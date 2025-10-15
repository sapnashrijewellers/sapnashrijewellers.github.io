
// src/utils/sendPush.js
  function base64UrlToArrayBuffer(b64url) {
    const padding = "=".repeat((4 - b64url.length % 4) % 4);
    const b64 = (b64url + padding).replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }
  
  function getJwkComponentsFromPublicKey(vapidPublicB64Url) {
    const buffer = base64UrlToArrayBuffer(vapidPublicB64Url);
    const publicKeyBytes = new Uint8Array(buffer);
    if (publicKeyBytes.length !== 65 || publicKeyBytes[0] !== 4) {
      throw new Error("Invalid VAPID Public Key format. Must be 65 uncompressed bytes (0x04 prefix).");
    }
    const x = publicKeyBytes.slice(1, 33);
    const y = publicKeyBytes.slice(33, 65);
    return {
      x: base64UrlEncodeUint8(x),
      y: base64UrlEncodeUint8(y)
    };
  }
  
  function derToJoseSignature(der) {
    const bytes = new Uint8Array(der);
    if (bytes[0] !== 48) throw new Error("Invalid DER signature");
    let idx = 2;
    if (bytes[1] & 128) {
      idx = 2 + (bytes[1] & 127);
    }
    if (bytes[idx] !== 2) throw new Error("Invalid DER R header");
    const rLen = bytes[idx + 1];
    const rStart = idx + 2;
    const r = bytes.slice(rStart, rStart + rLen);
    const sIdx = rStart + rLen;
    if (bytes[sIdx] !== 2) throw new Error("Invalid DER S header");
    const sLen = bytes[sIdx + 1];
    const sStart = sIdx + 2;
    const s = bytes.slice(sStart, sStart + sLen);
    function to32BytesTrimmed(arr) {
      let i = 0;
      while (i < arr.length - 1 && arr[i] === 0) i++;
      const trimmed = arr.slice(i);
      if (trimmed.length > 32) throw new Error("r or s too long");
      const out2 = new Uint8Array(32);
      out2.set(trimmed, 32 - trimmed.length);
      return out2;
    }
    
    const r32 = to32BytesTrimmed(r);
    const s32 = to32BytesTrimmed(s);
    const out = new Uint8Array(64);
    out.set(r32, 0);
    out.set(s32, 32);
    return out.buffer;
  }
  
  function base64UrlEncodeUint8(arr) {
    const b64 = btoa(String.fromCharCode(...new Uint8Array(arr)));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  
  async function generateVapidJWT(audience, vapidPrivateB64Url, vapidPublicB64Url) {
    const header = { typ: "JWT", alg: "ES256" };
    const exp = Math.floor(Date.now() / 1e3) + 60 * 60;
    const payload = { aud: audience, exp, sub: "https://localhost" };
    console.log("generateVapidJWT payload:", payload);
    console.log(payload);
    const encode = (obj) => base64UrlEncodeUint8(new TextEncoder().encode(JSON.stringify(obj)));
    const jwtHeader = encode(header);
    const jwtPayload = encode(payload);
    const data = `${jwtHeader}.${jwtPayload}`;
    const { x, y } = getJwkComponentsFromPublicKey(vapidPublicB64Url);
    const jwk = {
      kty: "EC",
      crv: "P-256",
      d: vapidPrivateB64Url,
      // Private component
      x,
      // Public X coordinate
      y,
      // Public Y coordinate
      ext: true
    };
    const privateKey = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign"]
    );
    const sigDer = await crypto.subtle.sign(
      { name: "ECDSA", hash: "SHA-256" },
      privateKey,
      new TextEncoder().encode(data)
    );
    let sigJose;
    if (sigDer.byteLength === 64) {
      sigJose = sigDer;
    } else {
      sigJose = derToJoseSignature(sigDer);
    }
    const sigB64Url = base64UrlEncodeUint8(sigJose);
    const jwt = `${data}.${sigB64Url}`;
    return jwt;
  }
  
  export async function sendPushToSubscription(subscription, payloadJson) {
    const vapidPublicB64Url = "BKX0C-dcKvSLhEunwNiaOJA2hY1yh4PTCSFngeKPbiWjJaC1Tm_JXKi7Cjtq8KENLaXcr07RKGO27ZqkDiSV4v4";
    const vapidPrivateB64Url = "Tkyw9G8XnpN0cUNHT3Bj8FMDTDaXq4LZi-SVGHcyaXY";
    const endpoint = subscription.endpoint;
    const audience = new URL(endpoint).origin;
    console.log(audience);
    const jwt = await generateVapidJWT(audience, vapidPrivateB64Url, vapidPublicB64Url);
    const authHeader = `WebPush ${jwt}`;
    console.log(authHeader);
    console.log("body:", payloadJson);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "TTL": "60",
        "Content-Encoding": "aesgcm",
        "Authorization": authHeader,
        // Add the mandatory Crypto-Key header for FCM, 
        // formatted as p256ecdsa=<VAPID public key>.
        "Crypto-Key": `p256ecdsa=${vapidPublicB64Url}`
      },
      body: JSON.stringify(payloadJson)
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Push failed with ${res.status}: ${text}`);
    }
    return res;
  }

