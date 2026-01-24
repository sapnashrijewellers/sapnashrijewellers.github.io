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
//import {createOrder, placeOrder,getOrder} from "./order";
//import {updateUser,getUser} from "./user";
import {subscribeUser,deleteSubscription,listSubs } from "./subscription"

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
			return await subscribeUser(request, env, headers);
		}

		if (url.pathname === "/subscription" && request.method === "DELETE") {
			return deleteSubscription(request, env);
		}

		if (url.pathname === "/subscriptions") {
			return await listSubs(env.USER_SUBSCRIPTIONS);
		}

		if (url.pathname === "/order" && request.method === "PUT") {
			return await createOrder(request, env, headers);
		}

		if (url.pathname === "/order" && request.method === "POST") {
			return await placeOrder(request, env, headers);
		}

		if (url.pathname === "/cart" && request.method === "PUT") {
			return await addToCart(request, env, headers);
		}
		if (url.pathname === "/cart" && request.method === "DELETE") {
			return await deleteFromCart(request, env, headers);
		}

		if (url.pathname === "/user" && request.method === "POST") {
			return await updateUser(request, env, headers);
		}
		return new Response(JSON.stringify({ error: "Invalid request" }), { headers, status: 400 });
	}

	catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { headers, status: 500 });
	}
}

