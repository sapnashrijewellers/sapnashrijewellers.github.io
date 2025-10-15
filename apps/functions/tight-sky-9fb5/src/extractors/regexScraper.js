/**
 * Fetches HTML from a URL and uses a regex to extract the content
 * of a specific element based on its ID.
 * * NOTE: This method relies on regex and is highly fragile to HTML structure changes.
 * * @param {string} url The URL to fetch.
 * @param {string} id The HTML ID of the element whose content needs extraction.
 * @returns {Promise<string>} The extracted text content or an error message.
 */
export async function scrapeContentById(url, id) {
    // Escape ID for safe use in the RegExp constructor
    const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // The regex attempts to find:
    // 1. The start tag with the exact ID: <tag id="ID"...>
    // 2. Capture the content non-greedily: ([\s\S]*?)
    // 3. The end tag: </tag>
    const regex = new RegExp(
        `<[^>]*id=["']${escapedId}["'][^>]*>([\\s\\S]*?)<\\/[^>]*>`, 
        'i' // Case-insensitive match for tags and attributes
    );

    try {
        // Cloudflare Workers provide the native fetch API
        const response = await fetch(url);
        
        if (!response.ok) {
            return `Fetch failed with status: ${response.status}`;
        }
        
        const html = await response.text();
        const match = html.match(regex);
        
        if (match && match[1]) {
            // Return the captured content, trimmed of leading/trailing whitespace
            return match[1].trim();
        } else {
            return `Content not found for ID: ${id}. The HTML structure may have changed, or the regex failed.`;
        }
    } catch (e) {
        // Catch network errors, timeouts, etc.
        return `Error during fetch or processing: ${e.message}`;
    }
}

