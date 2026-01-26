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
      return json({ address: null }, 200, headers);
    }

    return json(
      { address: JSON.parse(data) },
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

/* ---------------- helpers ---------------- */

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers,
  });
}
