// src/address.js

export async function updateAddress(request, env, headers) {
  try {
    const body = await request.json();
    const {
      uid,
      name,
      email,
      mobile,
      address,
      city,
      pin,
    } = body;

    if (!uid) {
      return json({ error: "uid is required" }, 400, headers);
    }

    const addressPayload = {
      uid,
      name,
      email,
      mobile,
      address,
      city,
      pin,
      updatedAt: new Date().toISOString(),
    };

    await env.USER_ADDRESSES.put(
      uid,
      JSON.stringify(addressPayload)
    );

    return json(
      { success: true, address: addressPayload },
      200,
      headers
    );
  } catch (err) {
    return json(
      { error: "Failed to update address", details: err.message },
      500,
      headers
    );
  }
}

export async function getAddress(request, env, headers) {
  try {
    const url = new URL(request.url);
    const uid = url.searchParams.get("uid");

    if (!uid) {
      return json({ error: "uid is required" }, 400, headers);
    }

    const data = await env.USER_ADDRESSES.get(uid);

    if (!data) {
      return json({ error:"Address not found" }, 404, headers);
    }

    return json(
      JSON.parse(data),
      200,
      headers
    );
  } catch (err) {
    return json(
      { error: "Failed to fetch address", details: err.message },
      500,
      headers
    );
  }
}

export async function deleteAllAddresses(request, env, headers) {
  return;
  try {
    let listComplete = false;
    let cursor = undefined;

    while (!listComplete) {
      // 1. List a batch of keys (up to 1000)
      const listResponse = await env.USER_ADDRESSES.list({ cursor });
      const keys = listResponse.keys;

      if (keys.length > 0) {
        // 2. Delete the batch in parallel (much faster)
        await Promise.all(
          keys.map((k) => env.USER_ADDRESSES.delete(k.name))
        );
      }

      // 3. Check if there are more keys to fetch
      listComplete = listResponse.list_complete;
      cursor = listResponse.cursor;
    }

    return new Response(
      JSON.stringify({ success: true, message: "All addresses deleted successfully" }),
      { headers: { ...headers, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { ...headers, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

/* ---------------- helpers ---------------- */

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers,
  });
}
