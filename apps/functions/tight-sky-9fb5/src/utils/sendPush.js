export function base64UrlToArrayBuffer(b64url) {
  const padding = "=".repeat((4 - (b64url.length % 4)) % 4);
  const b64 = (b64url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
function getJwkComponentsFromPublicKey(vapidPublicB64Url) {
  // Decode the 65-byte public key buffer (0x04 || x || y)
  const buffer = base64UrlToArrayBuffer(vapidPublicB64Url);
  const publicKeyBytes = new Uint8Array(buffer);

  // Check for the uncompressed 65-byte format (0x04 prefix)
  if (publicKeyBytes.length !== 65 || publicKeyBytes[0] !== 0x04) {
    throw new Error("Invalid VAPID Public Key format. Must be 65 uncompressed bytes (0x04 prefix).");
  }

  // Extract x (bytes 1-32) and y (bytes 33-64)
  const x = publicKeyBytes.slice(1, 33);
  const y = publicKeyBytes.slice(33, 65);

  // Base64URL encode them
  return {
    x: base64UrlEncodeUint8(x),
    y: base64UrlEncodeUint8(y)
  };
}

// DER ECDSA signature -> raw R||S (each padded to 32 bytes)
function derToJoseSignature(der) {
  // der is ArrayBuffer of ASN.1 signature
  const bytes = new Uint8Array(der);
  // simple DER parser (assumes well-formed ECDSA signature)
  /* ASN.1 signature structure:
    0x30 LEN 0x02 Rlen R 0x02 Slen S
  */
  if (bytes[0] !== 0x30) throw new Error("Invalid DER signature");
  let idx = 2;
  if (bytes[1] & 0x80) { idx = 2 + (bytes[1] & 0x7f); } // handle long len (unlikely)
  // find R
  if (bytes[idx] !== 0x02) throw new Error("Invalid DER R header");
  const rLen = bytes[idx + 1];
  const rStart = idx + 2;
  const r = bytes.slice(rStart, rStart + rLen);
  const sIdx = rStart + rLen;
  if (bytes[sIdx] !== 0x02) throw new Error("Invalid DER S header");
  const sLen = bytes[sIdx + 1];
  const sStart = sIdx + 2;
  const s = bytes.slice(sStart, sStart + sLen);

  // Convert r and s to 32-byte big-endian
  function to32BytesTrimmed(arr) {
    // strip leading zeros
    let i = 0;
    while (i < arr.length - 1 && arr[i] === 0) i++;
    const trimmed = arr.slice(i);
    if (trimmed.length > 32) throw new Error("r or s too long");
    const out = new Uint8Array(32);
    out.set(trimmed, 32 - trimmed.length);
    return out;
  }

  const r32 = to32BytesTrimmed(r);
  const s32 = to32BytesTrimmed(s);
  const out = new Uint8Array(64);
  out.set(r32, 0);
  out.set(s32, 32);
  return out.buffer;
}

// create base64url
export function base64UrlEncodeUint8(arr) {
  const b64 = btoa(String.fromCharCode(...new Uint8Array(arr)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// /**
//  * Generates a signed VAPID JWT string for authorization.
//  * @param {string} audience - The origin of the push service (e.g., https://fcm.googleapis.com).
//  * @param {string} vapidPrivateB64Url - The VAPID private key scalar (Base64URL).
//  * @param {string} vapidPublicB64Url - The VAPID public key (Base64URL, uncompressed format).
//  * @returns {Promise<string>} The signed JWT.
//  */
// export async function generateVapidJWT(audience, vapidPrivateB64Url, vapidPublicB64Url) {
//   // header & payload
//   // Removed 'typ: "JWT"' from the header for maximum compatibility with strict push services (like FCM).
//   const header = { typ: "JWT", alg: "ES256" };
//   // Reduced JWT expiration time to 1 hour (3600 seconds) 
//   const exp = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour validity

//   // 💡 FIX APPLIED HERE: Changed the 'sub' claim from mailto: to a standard HTTPS URL.
//   // Replace 'https://your.website.com' with your actual contact URL when you use real keys.
//   const payload = { aud: audience, exp, sub: "https://localhost" };

//   const encode = (obj) =>
//     base64UrlEncodeUint8(new TextEncoder().encode(JSON.stringify(obj)));

//   const jwtHeader = encode(header);
//   const jwtPayload = encode(payload);
//   const data = `${jwtHeader}.${jwtPayload}`;

//   // Get the public coordinates (x and y) from the public key string
//   const { x, y } = getJwkComponentsFromPublicKey(vapidPublicB64Url);

//   // Formulate the complete private JWK, including public components
//   const jwk = {
//     kty: "EC",
//     crv: "P-256",
//     d: vapidPrivateB64Url, // Private component
//     x: x,                  // Public X coordinate
//     y: y,                  // Public Y coordinate
//     ext: true,
//   };

//   const privateKey = await crypto.subtle.importKey(
//     "jwk",
//     jwk,
//     { name: "ECDSA", namedCurve: "P-256" },
//     false,
//     ["sign"]
//   );

//   // sign the data (JWT requires signature over ASCII bytes of data)
//   const sigDer = await crypto.subtle.sign(
//     { name: "ECDSA", hash: "SHA-256" },
//     privateKey,
//     new TextEncoder().encode(data)
//   );

//   let sigJose;
//   // Check if the runtime returned raw R||S (64 bytes) or DER (variable length, usually > 64)
//   if (sigDer.byteLength === 64) {
//     // If 64 bytes, assume it's already the JOSE format (raw R||S)
//     sigJose = sigDer;
//   } else {
//     // Otherwise, assume it's the standard DER format and parse it
//     sigJose = derToJoseSignature(sigDer);
//   }

//   const sigB64Url = base64UrlEncodeUint8(sigJose);

//   const jwt = `${data}.${sigB64Url}`;
//   return jwt;
// }

/**
 * Retrieves all push subscriptions from the provided KV store.
 * NOTE: This function requires the KV Namespace binding to be passed in.
 * @param {KVNamespace} USER_SUBSCRIPTIONS - The KV namespace binding (e.g., env.USER_SUBSCRIPTIONS).
 * @returns {Promise<Response>} A JSON response containing the list of subscriptions.
 */
export async function listSubs(USER_SUBSCRIPTIONS) {
  const keys = await USER_SUBSCRIPTIONS.list();
  const subscriptions = [];

  // Fetch the value for each key
  for (const k of keys.keys) {
    const subString = await USER_SUBSCRIPTIONS.get(k.name);
    try {
      if (subString) {
        // Parse the stored subscription string
        const sub = JSON.parse(subString);
        // Include the key (user ID) alongside the subscription data
        subscriptions.push({ userId: k.name, subscription: sub });
      }
    } catch (e) {
      console.error(`Failed to parse subscription for key ${k.name}:`, e);
    }
  }

  // Return a JSON response with the collected subscriptions
  return new Response(JSON.stringify(subscriptions, null, 2), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
}

/**
 * Deletes a specific subscription key from the KV store.
 * This is useful for manually removing expired or invalid subscriptions (like the 403 failure case).
 * @param {KVNamespace} USER_SUBSCRIPTIONS - The KV namespace binding.
 * @param {string} subscriptionId - The key associated with the subscription (e.g., the full endpoint URL).
 * @returns {Promise<Response>} A JSON response confirming deletion.
 */
export async function deleteSubs(USER_SUBSCRIPTIONS) {
  const keys = await USER_SUBSCRIPTIONS.list();

  // Fetch the value for each key
  for (const k of keys.keys) {
    await USER_SUBSCRIPTIONS.delete(k.name);
  }
  return new Response(JSON.stringify({ message: `Successfully deleted all subscriptions` }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
}

export async function sendPushToSubscription(subscription, payloadJson) {
  // ⚠️ IMPORTANT: These keys MUST be pulled from secure environment variables (Secrets) in production.
  // DO NOT hardcode them like this in a final Worker.
  const vapidPublicB64Url = "BKX0C-dcKvSLhEunwNiaOJA2hY1yh4PTCSFngeKPbiWjJaC1Tm_JXKi7Cjtq8KENLaXcr07RKGO27ZqkDiSV4v4";
  const vapidPrivateB64Url = "Tkyw9G8XnpN0cUNHT3Bj8FMDTDaXq4LZi-SVGHcyaXY";

  const endpoint = subscription.endpoint;
  const audience = new URL(endpoint).origin;

  // 1. Generate the VAPID JWT for authentication (requires YOUR keys)
  const jwt = await generateVapidJWT(audience, vapidPrivateB64Url, vapidPublicB64Url);

  // 2. Encrypt the payload (requires YOUR keys + USER keys)
  const { encryptedPayload, headers: encryptionHeaders } =
    await encryptPayload(subscription, payloadJson);

  // Re-define finalHeaders for clarity and correctness:
  const combinedCryptoKey = `p256ecdsa=${vapidPublicB64Url}; p256dh=${subscription.keys.p256dh}`;
  console.log(headers);
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "TTL": "60",
      "Content-Length": encryptedPayload.byteLength.toString(),
      "Content-Encoding": "aesgcm",
      "Authorization": `WebPush ${jwt}`,
      "Crypto-Key": combinedCryptoKey,
      "Encryption": encryptionHeaders['Encryption'], // Contains the salt
      "Content-Type": "application/octet-stream"
    },
    body: encryptedPayload,
  });
  console.log(headers);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Push failed with ${res.status}: ${text}`);
  }
  return res;
}

async function encryptPayload(subscription, rawPayload) {
  // 1. Extract and Decode Keys from the User's Subscription
  const authSecret = base64UrlToUint8Array(subscription.keys.auth);
  const receiverPublicKey = base64UrlToUint8Array(subscription.keys.p256dh);

  // 2. Generate Cryptographic Primitives (Salt and Info)
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const textEncoder = new TextEncoder();
  const hkdfInfo = textEncoder.encode('Content-Encoding: aesgcm');
  const keyLength = 16; 

  // 3. Key Derivation (HKDF) to create the encryption key
  const contentEncryptionKey = await deriveKey(
    authSecret,
    receiverPublicKey,
    salt,
    hkdfInfo,
    keyLength
  );

  // 4. Construct the Encryption Input Buffer
  const paddingLengthBytes = new Uint8Array([0, 0]);
  const payloadBytes = textEncoder.encode(rawPayload);
  const inputLength = payloadBytes.length + paddingLengthBytes.length;

  const encryptionInputBuffer = new Uint8Array(inputLength);
  encryptionInputBuffer.set(paddingLengthBytes, 0);
  encryptionInputBuffer.set(payloadBytes, paddingLengthBytes.length);

  // 5. Encrypt the Buffer using AES-GCM
  const initializationVector = new Uint8Array(12);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: initializationVector },
    contentEncryptionKey,
    encryptionInputBuffer
  );

  // 6. Generate Authorization Headers (VAPID)
  // 🛑 FIX: We removed this call. JWT generation should only happen once in the sender function.
  // The JWT is ONLY needed for the Authorization header, not for content encryption.

  // 7. Assemble Final Headers and Return
  const finalHeaders = {
    // 🟢 CRITICAL: This is the ONLY necessary header from the encryption process.
    'Encryption': `salt=${uint8ArrayToBase64Url(salt)}`,
    // Web Push standard requires the p256dh key in one of the encryption-related headers
    'Crypto-Key': `p256dh=${subscription.keys.p256dh}`, 
    // TTL is not encryption-specific
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'aesgcm',
    'Content-Length': ciphertext.byteLength.toString()
  };

  return {
    encryptedPayload: ciphertext,
    headers: finalHeaders,
  };
}
/**
 * Generates the VAPID Authorization header (JWT).
 * This uses the Workers-native subtle crypto for ECDSA signing.
 */
async function generateVAPIDHeader(audience, vapidPrivateKey, vapidPublicKey) {
  // 1. Split the VAPID public key into its coordinates
  const { x, y } = splitVAPIDPublicKey(vapidPublicKey);

  // 2. Import VAPID Private Key (the fix is in the jwk structure)
  const privateKey = await crypto.subtle.importKey(
    'jwk',
    {
      kty: 'EC',       // Key Type: Elliptic Curve
      crv: 'P-256',    // Curve Name
      x: x,            // Public Key X Coordinate (REQUIRED)
      y: y,            // Public Key Y Coordinate (REQUIRED)
      d: vapidPrivateKey, // Private Key D Component
      ext: true
    },
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );

  const keyId = 'keyid'; // Standard for this type of JWT

  // 2. Build JWT Payload
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiration = issuedAt + 12 * 60 * 60; // 12 hours TTL

  const jwtHeader = { alg: 'ES256', typ: 'JWT', kid: keyId };
  const jwtPayload = { aud: audience, exp: expiration, sub: 'https://localhost' };

  const encodedHeader = uint8ArrayToBase64Url(new TextEncoder().encode(JSON.stringify(jwtHeader)));
  const encodedPayload = uint8ArrayToBase64Url(new TextEncoder().encode(JSON.stringify(jwtPayload)));

  const tokenToSign = `${encodedHeader}.${encodedPayload}`;

  // 3. Sign the Token
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privateKey,
    new TextEncoder().encode(tokenToSign)
  );

  const encodedSignature = uint8ArrayToBase64Url(new Uint8Array(signature));

  // 4. Construct Final Headers
  const token = `${tokenToSign}.${encodedSignature}`;

  return {
    Authorization: `WebPush ${token}`,
    'Crypto-Key': `p256ecdsa=${vapidPublicKey}`,
    TTL: '43200' // 12 hours in seconds
  };
}

// Renamed from generateVAPIDHeader to generateVapidJWT for consistency
// export async function generateVapidJWT(audience, vapidPrivateB64Url, vapidPublicB64Url) {
//   // 1. Split the VAPID public key into its coordinates
//   const { x, y } = splitVAPIDPublicKey(vapidPublicB64Url);

//   // 2. Import VAPID Private Key (JWK)
//   const privateKey = await crypto.subtle.importKey(
//     'jwk',
//     {
//       kty: 'EC', crv: 'P-256', x: x, y: y, d: vapidPrivateB64Url, ext: true
//     },
//     { name: 'ECDSA', namedCurve: 'P-256' },
//     false,
//     ['sign']
//   );

//   // 3. Build JWT Payload
//   const issuedAt = Math.floor(Date.now() / 1000);
//   const expiration = issuedAt + 12 * 60 * 60; // 12 hours TTL
//   const jwtHeader = { alg: 'ES256', typ: 'JWT' }; // Removed 'kid: keyId' for simplicity
//   const jwtPayload = { aud: audience, exp: expiration, sub: 'https://localhost' };

//   const encode = (obj) => uint8ArrayToBase64Url(new TextEncoder().encode(JSON.stringify(obj)));
//   const data = `${encode(jwtHeader)}.${encode(jwtPayload)}`;

//   // 4. Sign the Token
//   const signature = await crypto.subtle.sign(
//     { name: 'ECDSA', hash: 'SHA-256' },
//     privateKey,
//     new TextEncoder().encode(data)
//   );
  
//   let sigJose;
//   if (signature.byteLength === 64) {
//     sigJose = signature;
//   } else {
//     sigJose = derToJoseSignature(signature);
//   }

//   const token = `${data}.${uint8ArrayToBase64Url(sigJose)}`;
//   return token;
// }
/**
 * Utility to split the 65-byte VAPID Public Key (Base64URL) into its x and y components.
 * @param {string} vapidPublicKey - The full Base64URL public key.
 * @returns {{x: string, y: string}}
 */
function splitVAPIDPublicKey(vapidPublicKey) {
  const keyBytes = base64UrlToUint8Array(vapidPublicKey);
  // The first byte (0x04) identifies the uncompressed point.
  // x is bytes 1-32 (32 bytes)
  const x = keyBytes.slice(1, 33);
  // y is bytes 33-64 (32 bytes)
  const y = keyBytes.slice(33, 65);

  return {
    x: uint8ArrayToBase64Url(x),
    y: uint8ArrayToBase64Url(y)
  };
}

function base64UrlToUint8Array(base64Url) {
  const padding = '==='.slice(0, (4 - (base64Url.length % 4)) % 4);
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/') + padding;
  const rawData = atob(base64);
  return Uint8Array.from(rawData, char => char.charCodeAt(0));
}

function uint8ArrayToBase64Url(array) {
  return btoa(String.fromCharCode.apply(null, array))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// HKDF Key Derivation (this is critical and standard)
async function deriveKey(authSecret, receiverPublicKey, salt, keyInfo, keyLength) {
  // In deriveKey: Use 'raw' for the name and 'derive' for the usage.
  const prk = await crypto.subtle.importKey(
    'raw',        // Key format: raw bytes
    authSecret,   // The IKM (the authSecret)
    'HKDF',       // The algorithm it will be used for (Key derivation algorithm)
    false,        // exportable: false
    ['deriveKey'] // Usages: Only for derivation
  );

  const extracted = await crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: salt,
      info: keyInfo,
    },
    prk, // The imported raw key
    { name: 'AES-GCM', length: keyLength * 8 },
    true,
    ['encrypt', 'decrypt']
  );


  return extracted;
}


