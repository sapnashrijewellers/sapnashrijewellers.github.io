/**
 * Utility: Converts a Base64URL string to an ArrayBuffer.
 * This is the Web Push standard decoding method.
 * @param {string} b64url - Base64URL encoded string.
 * @returns {ArrayBuffer}
 */
export function base64UrlToArrayBuffer(b64url) {
  const padding = "=".repeat((4 - (b64url.length % 4)) % 4);
  const b64 = (b64url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

/**
 * Utility: Converts a Base64URL string to a Uint8Array.
 * @param {string} base64Url
 * @returns {Uint8Array}
 */
function base64UrlToUint8Array(base64Url) {
  const padding = '==='.slice(0, (4 - (base64Url.length % 4)) % 4);
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/') + padding;
  const rawData = atob(base64);
  return Uint8Array.from(rawData, char => char.charCodeAt(0));
}

/**
 * Utility: Converts a Uint8Array to a Base64URL string.
 * @param {Uint8Array} array
 * @returns {string}
 */
function uint8ArrayToBase64Url(array) {
  // Use String.fromCharCode.apply(null, array) instead of spread for better performance on large arrays
  const binary = String.fromCharCode.apply(null, array);
  return btoa(binary)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Utility: Splits the 65-byte VAPID Public Key (Base64URL) into its x and y components.
 * @param {string} vapidPublicKey - The full Base64URL public key (65 bytes, uncompressed).
 * @returns {{x: string, y: string}}
 */
function splitVAPIDPublicKey(vapidPublicKey) {
  const keyBytes = base64UrlToUint8Array(vapidPublicKey);
  // Check for the uncompressed 65-byte format (0x04 prefix)
  if (keyBytes.length !== 65 || keyBytes[0] !== 0x04) {
    throw new Error("Invalid VAPID Public Key format. Must be 65 uncompressed bytes (0x04 prefix).");
  }

  // x is bytes 1-32 (32 bytes)
  const x = keyBytes.slice(1, 33);
  // y is bytes 33-64 (32 bytes)
  const y = keyBytes.slice(33, 65);

  return {
    x: uint8ArrayToBase64Url(x),
    y: uint8ArrayToBase64Url(y)
  };
}


/**
 * Utility: Converts a DER ECDSA signature to the 64-byte raw R||S format (JOSE format).
 * @param {ArrayBuffer} der - The ASN.1 DER encoded signature.
 * @returns {ArrayBuffer} - The 64-byte R||S signature.
 */
function derToJoseSignature(der) {
  const bytes = new Uint8Array(der);
  if (bytes[0] !== 0x30) throw new Error("Invalid DER signature");
  let idx = 2;
  if (bytes[1] & 0x80) { idx = 2 + (bytes[1] & 0x7f); } // handle long len (unlikely)

  if (bytes[idx] !== 0x02) throw new Error("Invalid DER R header");
  const rLen = bytes[idx + 1];
  const rStart = idx + 2;
  const r = bytes.slice(rStart, rStart + rLen);
  const sIdx = rStart + rLen;

  if (bytes[sIdx] !== 0x02) throw new Error("Invalid DER S header");
  const sLen = bytes[sIdx + 1];
  const sStart = sIdx + 2;
  const s = bytes.slice(sStart, sStart + sLen);

  function to32BytesTrimmed(arr) {
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

/**
 * Utility: HKDF Key Derivation (Web Push standard)
 * This function focuses strictly on the HKDF part using the shared authSecret.
 * @param {Uint8Array} authSecret - The authentication secret from the subscription.
 * @param {Uint8Array} receiverPublicKey - The receiver's public key (p256dh).
 * @param {Uint8Array} salt - The random 16-byte salt.
 * @param {Uint8Array} keyInfo - The 'Content-Encoding: aesgcm' info string.
 * @param {number} keyLength - The desired key length (16 for AES-GCM).
 * @returns {Promise<CryptoKey>} The derived Content Encryption Key.
 */
async function deriveKey(authSecret, receiverPublicKey, salt, keyInfo, keyLength) {
  // 1. Import the raw authSecret as the Pseudo-Random Key (PRK) for HKDF.
  // This step is standard for the first part of the Web Push HKDF process.
  const prk = await crypto.subtle.importKey(
    'raw',        // Key format: raw bytes
    authSecret,   // The IKM (authSecret)
    'HKDF',       // Algorithm: HKDF
    false,        // Exportable: false
    ['deriveKey'] // Usages: Only for derivation
  );

  // 2. Perform the HKDF extraction and expansion.
  // The 'receiverPublicKey' is technically used in the full IKM calculation (not shown here),
  // but for the final step of deriving the Content Encryption Key (CEK),
  // we use the PRK, Salt, and Info.
  const derived = await crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: salt,
      info: keyInfo,
    },
    prk, // The imported raw key (PRK)
    { name: 'AES-GCM', length: keyLength * 8 },
    true,
    ['encrypt'] // Only 'encrypt' is strictly needed for sending a push
  );

  return derived;
}

/**
 * Generates a signed VAPID JWT string for authorization.
 * @param {string} audience - The origin of the push service (e.g., https://fcm.googleapis.com).
 * @param {string} vapidPrivateB64Url - The VAPID private key scalar (Base64URL).
 * @param {string} vapidPublicB64Url - The VAPID public key (Base64URL, uncompressed format).
 * @returns {Promise<string>} The signed JWT.
 */
export async function generateVapidJWT(audience, vapidPrivateB64Url, vapidPublicB64Url) {
  const { x, y } = splitVAPIDPublicKey(vapidPublicB64Url);

  const jwk = {
    kty: "EC", crv: "P-256", d: vapidPrivateB64Url, x: x, y: y, ext: true
  };

  const privateKey = await crypto.subtle.importKey(
    "jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]
  );

  // Header & Payload
  const header = { alg: "ES256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour validity
  const payload = { aud: audience, exp, sub: "https://localhost" }; // Use a real 'mailto:' or URL in production

  const encode = (obj) => uint8ArrayToBase64Url(new TextEncoder().encode(JSON.stringify(obj)));

  const data = `${encode(header)}.${encode(payload)}`;

  // Sign the data
  const sigDer = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privateKey,
    new TextEncoder().encode(data)
  );

  // Convert DER signature to JOSE format (R||S)
  let sigJose;
  if (sigDer.byteLength === 64) {
    sigJose = sigDer;
  } else {
    sigJose = derToJoseSignature(sigDer);
  }

  const sigB64Url = uint8ArrayToBase64Url(new Uint8Array(sigJose));

  return `${data}.${sigB64Url}`;
}


/**
 * Encrypts the payload for the push service.
 * @param {object} subscription - The user's push subscription object.
 * @param {string} rawPayload - The JSON string payload (will be converted to text).
 * @returns {Promise<{encryptedPayload: ArrayBuffer, headers: object}>}
 */
async function encryptPayload(subscription, rawPayload) {
  // 1. Extract and Decode Keys
  const authSecret = base64UrlToUint8Array(subscription.keys.auth);
  const receiverPublicKey = base64UrlToUint8Array(subscription.keys.p256dh);

  // 2. Generate Cryptographic Primitives
  const salt = crypto.getRandomValues(new Uint8Array(16)); // 16-byte random salt
  const textEncoder = new TextEncoder();
  const hkdfInfo = textEncoder.encode('Content-Encoding: aesgcm');
  const keyLength = 16; // 16 bytes for AES-GCM

  // 3. Key Derivation (HKDF)
  const contentEncryptionKey = await deriveKey(
    authSecret,
    receiverPublicKey,
    salt,
    hkdfInfo,
    keyLength
  );

  // 4. Construct the Encryption Input Buffer (Padding + Payload)
  // Web Push requires 2 bytes of padding (0x00 0x00) before the content
  const paddingLengthBytes = new Uint8Array([0, 0]);
  const payloadBytes = textEncoder.encode(rawPayload);
  const inputLength = payloadBytes.length + paddingLengthBytes.length;

  const encryptionInputBuffer = new Uint8Array(inputLength);
  encryptionInputBuffer.set(paddingLengthBytes, 0);
  encryptionInputBuffer.set(payloadBytes, paddingLengthBytes.length);

  // 5. Encrypt the Buffer using AES-GCM
  const initializationVector = new Uint8Array(12); // Standard 12-byte IV (all zeros for Web Push)
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: initializationVector },
    contentEncryptionKey,
    encryptionInputBuffer
  );

  // 6. Assemble Final Headers
  const finalHeaders = {
    // CRITICAL: Must include the salt
    'Encryption': `salt=${uint8ArrayToBase64Url(salt)}`,
    // The receiver's public key (p256dh) is not strictly needed here, but the VAPID key is.
    // The p256dh is already in the subscription object.
  };

  return {
    encryptedPayload: ciphertext,
    headers: finalHeaders,
  };
}

// -----------------------------------------------------------------------------

/**
 * Sends the push notification to a single subscription.
 * @param {object} subscription - The user's push subscription object.
 * @param {string} payloadJson - The JSON string payload to send.
 * @returns {Promise<Response>} The fetch response from the push service.
 */
export async function sendPushToSubscription(subscription, payloadJson) {
  // ⚠️ IMPORTANT: These keys MUST be pulled from secure environment variables (Secrets) in production.
  const vapidPublicB64Url = "BKX0C-dcKvSLhEunwNiaOJA2hY1yh4PTCSFngeKPbiWjJaC1Tm_JXKi7Cjtq8KENLaXcr07RKGO27ZqkDiSV4v4";
  const vapidPrivateB64Url = "Tkyw9G8XnpN0cUNHT3Bj8FMDTDaXq4LZi-SVGHcyaXY";

  const endpoint = subscription.endpoint;
  const audience = new URL(endpoint).origin;

  // 1. Generate the VAPID JWT for authentication
  const jwt = await generateVapidJWT(audience, vapidPrivateB64Url, vapidPublicB64Url);

  // 2. Encrypt the payload
  const { encryptedPayload, headers: encryptionHeaders } =
    await encryptPayload(subscription, payloadJson);

  // 3. Assemble ALL headers
  const combinedCryptoKey = `p256ecdsa=${vapidPublicB64Url};dh=${subscription.keys.p256dh}`;

  const finalHeaders = {
    "TTL": "60",
    "Content-Length": encryptedPayload.byteLength.toString(),
    "Content-Encoding": "aesgcm",
    // VAPID/Authorization Headers
    "Authorization": `WebPush ${jwt}`,
    "Crypto-Key": combinedCryptoKey, // <-- Use the corrected header here
    // Encryption Headers
    "Encryption": encryptionHeaders['Encryption'], // Contains the salt
    "Content-Type": "application/octet-stream"
  };


  // 4. Send the request
  const res = await fetch(endpoint, {
    method: "POST",
    headers: finalHeaders,
    body: encryptedPayload,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Push failed with ${res.status}: ${text}`);
  }
  return res;
}