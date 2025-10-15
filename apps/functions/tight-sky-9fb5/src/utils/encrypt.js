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