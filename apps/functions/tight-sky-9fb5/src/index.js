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
import { extract as extractRates } from './extractors/Arihanspot_extractor';
import { deleteSubs, listSubs, sendPushToSubscription } from "./utils/sendPush.js";

const SHEET_URL = "https://script.google.com/macros/s/AKfycbwNQ9fFmV0MqVEKg6pk-x56FsCw-xOnV__A3l6hqrlUVukKyx6gf31DpiO4hn4Vep6U5w/exec";

addEventListener("fetch", event => {
	event.respondWith(handleRequest(event.request, event));
});

addEventListener("scheduled", event => {
	event.waitUntil(handleScheduled(event));
});

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
			await USER_SUBSCRIPTIONS.put(sub.endpoint, JSON.stringify(sub));
			return new Response("Subscribed", { headers });
		}

		if (url.pathname === "/send") {
			return await sendAll(env);
		}

		if (url.pathname === "/subscriptions") {
			return await listSubs(USER_SUBSCRIPTIONS);
		}

		if (url.pathname === "/delete_subscriptions") {
			return await deleteSubs(USER_SUBSCRIPTIONS);
		}

		const type = url.searchParams.get("type");

		// Try reading from KV first
		const cachedData = await ssj_kv.get(type, { type: "json" });
		
		if (cachedData) {
			return new Response(JSON.stringify(cachedData, null, 2), { headers });
		}

		// If not found, compute fresh and store in KV
		const data = await fetchAndProcess(type);
		if (data) {
			await ssj_kv.put(type, JSON.stringify(data));
			return new Response(JSON.stringify(data, null, 2), { headers });
		}

		return new Response(JSON.stringify({ error: "Invalid type parameter" }), { headers, status: 400 });

	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), { headers, status: 500 });
	}
}

async function fetchAndProcess(type) {
	switch (type) {
		case "rate": {
			const rateResponse = await fetch(SHEET_URL + "?type=rate_config");
			const allRateConfig = await rateResponse.json();
			const rateConfig = allRateConfig.arihant_spot;
			let [goldRate, silverRate] = await extractRates(rateConfig);
			if (rateConfig.gold.display <= 0)
				goldRate = 0;
			if (rateConfig.silver.display <= 0)
				silverRate = 0;			
			return {
				asOn: new Date().toISOString(),
				"gold24K": goldRate,
				"gold22K": +(goldRate * 0.92).toFixed(2),
				"gold18K": +(goldRate * 0.75).toFixed(2),
				"silver": silverRate,
				"silverJewelry": +(silverRate * 0.92).toFixed(2),
			};
		}

		case "products": {
			const res = await fetch(SHEET_URL + "?type=products");
			return await res.json();
		}

		case "ticker": {
			const res = await fetch(SHEET_URL + "?type=ticker");
			return await res.json();
		}

		default:
			return null;
	}
}

async function handleScheduled(event) {
	//endpoint: localhost:xxx/__scheduled
	console.log("⏰ Scheduled event triggered:", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));

	const cron = event.cron;
	
	console.log("⏰ Scheduled event triggered with cron:", cron);

	// The `event.cron` property holds the cron string that initiated the event.
	switch (cron) {
		case "*/5 * * * *":
			// This matches the "Every 5 minutes" trigger
			await handle5MinRefresh();
			break;
			
		// case "0 13 * * *":
		// 	// This matches the "1 PM daily" trigger
		// 	await handle1PMTask();
		// 	break;

		// case "0 19 * * *":
		// 	// This matches the "7 PM daily" trigger
		// 	await handle7PMTask();
		// 	break;
		case "0 10−20 ∗ ∗ ∗":
			await sendAll();
			break;
		default:
			// Fallback for any unknown schedules
			console.log(`Unrecognized cron trigger: ${cron}`);
			break;
	}
	console.log("Job completed.");
}

async function handle5MinRefresh(event) {
	//endpoint: localhost:xxx/__scheduled
	const types = ["rate", "products", "ticker"];
	for (const type of types) {
		try {
			const data = await fetchAndProcess(type);
			
			if (data) {
				await ssj_kv.put(type, JSON.stringify(data));
				console.log(`✅ Updated KV for: ${type}`);
			}
		} catch (err) {
			console.error(`❌ Error refreshing ${type}:`, err);
		}
	}

	console.log("✅ KV cache refresh completed.");
}

async function sendAll(env) {	
	const keys = await USER_SUBSCRIPTIONS.list();	

	for (const k of keys.keys) {
		const sub = JSON.parse(await USER_SUBSCRIPTIONS.get(k.name));
		try {
			const payload = JSON.stringify({ title:"latest rate",body:"welcome user",trigger: true });
			await sendPushToSubscription(sub, payload);
			console.log("Sent to", k.name);
		} catch (err) {
			console.error("Failed for", k.name, err);
		}
	}
	return new Response("Done", { status: 200 });
}