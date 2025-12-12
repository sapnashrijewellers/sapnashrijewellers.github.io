/**
 * Fetches HTML from a URL and uses Cloudflare's HTMLRewriter 
 * to reliably extract the inner text content of the first element matching a CSS class,
 * then extracts only the number (the direct text node) from the result.
 * * @param {string} url The URL to fetch.
 * @param {string} className The CSS class name (e.g., 'data-box-half-value') 
 * of the element whose content needs extraction.
 * @returns {Promise<string>} The isolated number (e.g., "114,360") or an error message.
 */
export async function extractByClass(url, className) {
    const selector = `.${className}`;
    let extractedText = '';
    let elementFound = false;

    try {
       
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'text/html',
                'User-Agent': 'Mozilla/5.0 (compatible; Cloudflare Worker)' // A simpler, less "bot-like" User-Agent
            }
            //body: JSON.stringify({ currencyPair, type: "BUY" }),
        });
        
        if (!response.ok) {
            return `Fetch failed with status: ${response.status}`;
        }

        const dataHandler = {
            element(element) {                
                elementFound = true;                
            },

            // Called for every text chunk inside the selected element
            text(chunk) {
                if (elementFound) {
                    extractedText += chunk.text;
                    
                }
            },

            end(element) {
                if (elementFound) {
                    // Stop streaming for performance after the first element is processed
                    throw new Error('STOP_STREAMING_SUCCESSFULLY');
                }
            }
        };

        const rewriter = new HTMLRewriter().on(selector, dataHandler);

        try {
            // Execute the rewriter to run the handlers and populate extractedText
            await rewriter.transform(response).text();
        } catch (e) {
            if (e.message !== 'STOP_STREAMING_SUCCESSFULLY') {
                throw e;
            }
        }
        if (elementFound) {
            return extractedText;            
        } else {
            return `Element not found for class: ${className} using selector ${selector}.`;
        }

    } catch (e) {
        return `Error during fetch or processing: ${e.message}`;
    }
}


/**
 * Fetches HTML from a URL and uses Cloudflare's HTMLRewriter 
 * to reliably extract the inner text content of the first element matching a CSS ID.
 * * @param {string} url The URL to fetch.
 * @param {string} id The HTML ID of the element (e.g., 'GoldRatesCompare999') 
 * whose content needs extraction.
 * @returns {Promise<string>} The extracted text content or an error message.
 */
export async function extractById(url, id) {
    // 1. Form the CSS ID selector
    const selector = `#${id}`;

    let extractedText = '';
    let elementFound = false;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return `Fetch failed with status: ${response.status}`;
        }

        // 2. Define the Handler with both element() and text()
        const dataHandler = {
            // Called when the opening tag of the element matching the selector is found
            element(element) {
                // We use a flag to confirm we entered the element
                elementFound = true;
            },

            // Called for every text chunk *inside* the element matching the selector
            text(chunk) {
                // Only collect text if we found the element
                if (elementFound) {
                    extractedText += chunk.text;
                }
            },

            // Optional: Called when the closing tag of the element is encountered
            // We can use this to stop the stream early for performance
            end(element) {
                if (elementFound) {
                    // This is a common trick to stop the rewriter after the first match
                    throw new Error('STOP_STREAMING_SUCCESSFULLY');
                }
            }
        };

        // 3. Create and apply the HTMLRewriter
        const rewriter = new HTMLRewriter().on(selector, dataHandler);

        // We use a try/catch block around the transform call to catch the STOP_STREAMING error
        try {
            // Read the body of the transformed response to execute the handlers
            await rewriter.transform(response).text();
        } catch (e) {
            // If the error is our custom stop signal, treat it as a success
            if (e.message !== 'STOP_STREAMING_SUCCESSFULLY') {
                throw e; // Re-throw any other unexpected error
            }
        }

        if (elementFound) {
            // Return the captured content, trimmed of leading/trailing whitespace
            // For "<span id="GoldRatesCompare999">11326</span>", this returns "11326"
            return extractedText.trim();
        } else {
            return `Content not found for ID: ${id} using selector ${selector}.`;
        }

    } catch (e) {
        // Catch network errors or other unexpected errors
        return `Error during fetch or processing: ${e.message}`;
    }
}