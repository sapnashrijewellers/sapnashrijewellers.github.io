/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Scheduled Worker: a Worker that can run on a
 * configurable interval:
 * https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Run `curl "https://localhost:xxxx/__scheduled?cron=*+*+*+*+*"` to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env);
  },
};

async function handleRequest(request, env) {
	const headers = {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
	};
	if (request.method === "OPTIONS") {
		return new Response(null, { headers });
	}

	try {
		const url = new URL(request.url);
		if (url.pathname === "/subscribe" && request.method === "POST") {
			const sub = await request.json();
			await env.USER_SUBSCRIPTIONS.put(sub.endpoint, JSON.stringify(sub));
			return new Response("Subscribed", { headers });
		}		
		if (url.pathname === "/subscriptions") {
			return await listSubs(env.SER_SUBSCRIPTIONS);
		}		

		return new Response(JSON.stringify({ error: "Invalid type parameter" }), { headers, status: 400 });

	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { headers, status: 500 });
	}
}

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