export async function subscribeUser(request, env, headers) {
	try {
		const body = await request.json();

		// Validate payload
		if (!body || !body.endpoint) {
			return new Response(
				JSON.stringify({ error: "Missing or invalid subscription object" }),
				{ headers, status: 400 }
			);
		}

		const key = body.endpoint;
		const existing = await env.USER_SUBSCRIPTIONS.get(key);

		if (!existing) {
			// New subscription
			await env.USER_SUBSCRIPTIONS.put(key, JSON.stringify(body));
			return new Response(JSON.stringify({ message: "Subscribed successfully" }), {
				headers,
				status: 201,
			});
		}

		// Compare existing subscription data (ignore if identical)
		const existingObj = JSON.parse(existing);
		if (JSON.stringify(existingObj) === JSON.stringify(body)) {
			return new Response(JSON.stringify({ message: "Already subscribed" }), {
				headers,
				status: 200,
			});
		}

		// Update if changed
		await env.USER_SUBSCRIPTIONS.put(key, JSON.stringify(body));
		return new Response(JSON.stringify({ message: "Subscription updated" }), {
			headers,
			status: 200,
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), {
			headers,
			status: 500,
		});
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

export async function deleteSubscription(request, env) {

	const key = await request.text();
	//console.log("deleting: ",key);

	if (!key) {
		return new Response(
			JSON.stringify({ error: "Missing subscription key in request body" }),
			{ headers, status: 400 }
		);
	}

	await env.USER_SUBSCRIPTIONS.delete(key);

	return new Response(
		JSON.stringify({ success: true, message: "Subscription deleted" }),
		{ headers: { 'Content-Type': 'application/json' }, status: 200 }
	);
}