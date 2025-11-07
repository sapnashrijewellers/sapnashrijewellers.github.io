/**
 * Converts a VAPID public key from a URL-safe Base64 string to a Uint8Array.
 * This is required by the browser's PushManager API.
 */
function urlBase64ToUint8Array(base64String) {
    // Pad the string with '=' characters if necessary
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    
    // Replace URL-safe characters with standard Base64 characters
    const base64 = (base64String + padding)
        .replace(/-/g, '+') // Replace '-' with '+'
        .replace(/_/g, '/'); // Replace '_' with '/'

    // Decode the Base64 string
    const rawData = window.atob(base64);
    
    // Create a Uint8Array
    return new Uint8Array(
        [...rawData].map((char) => char.charCodeAt(0))
    );
}

// It must be the raw, uncompressed 65-byte point string. 
// Your previous key format was incorrect. I've left it here as a placeholder 
// for where you need to put the corrected string.
const VAPID_PUBLIC_KEY = "BKX0C-dcKvSLhEunwNiaOJA2hY1yh4PTCSFngeKPbiWjJaC1Tm_JXKi7Cjtq8KENLaXcr07RKGO27ZqkDiSV4v4"; 

/**
 * Handles notification permission, checks for an existing subscription, 
 * creates one if needed, and sends the endpoint to the server.
 * Relies on the pushManager being idempotent (it will only create a new 
 * subscription if one doesn't exist).
 * @param {string} baseURL - The base URL for the subscription server endpoint.
 */
export async function subscribeUser(baseURL, registration) {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.warn("Push notifications not supported in this environment.");
        return;
    }
    
    // 1. Request Notification Permission (only prompts if needed)
    try {
        const permission = await Notification.requestPermission();
        
        if (permission !== "granted") {
            console.log("Notification permission not granted. Subscription skipped.");
            return;
        }        
        //const registration = await navigator.serviceWorker.ready;
        
        // 2. Check for an existing subscription using the current key
        let subscription = await registration.pushManager.getSubscription();       
        
        // 3. Create a new subscription if none found
        if (!subscription) {            
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY), 
            });            
        }

        // 4. Send subscription to the server
        const response = await fetch(baseURL + "subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subscription),
        });

        if (!response.ok) {           
            const errorText = await response.text();
            console.error(`Server failed to store subscription (Status ${response.status}).`, errorText);
            // Throw an error to ensure the chain breaks if server failsgetSubsc
            throw new Error(`Server failed to store subscription: ${errorText}`); 
        }

    } catch (err) {
        // This catch block handles the 'InvalidAccessError' if the VAPID key is wrong,
        // or network errors, or server errors.
        console.error("❌ Fatal Subscription Error:", err.name, err.message);
        console.error("Please verify that VAPID_PUBLIC_KEY is the raw, 65-byte public key string.");
    }
}
