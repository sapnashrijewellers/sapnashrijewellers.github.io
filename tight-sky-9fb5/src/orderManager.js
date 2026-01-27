
export async function createOrder(request, env, headers) {
  try {
    const body = await request.json();
    const {
      cart,
      address,
      paymentMethod,
      paymentRef,
      priceSummary,
    } = body;
    const order = await createOrderCore({
      ORDERS_KV: env.ORDERS_KV,
      cart,
      address,
      paymentMethod,
      paymentRef,
      priceSummary,
    });
    console.log(order);
    return json(
      { success: true, address },
      200,
      headers
    );

  } catch (err) {
    return json({ error: "Failed to update order", details: err.message }, 400, headers);
  }

}

export async function getOrder({
  ORDERS_KV,
  userId,
  orderId,
}) {
  const order = await ORDERS_KV.get(`order:${orderId}`, "json");
  if (!order) return null;
  if (order.userId !== userId) return null;
  return order;
}


async function createOrderCore({
  ORDERS_KV,
  cart,
  address,
  paymentMethod,
  paymentRef,
  priceSummary,
}) {
  const userId = address.uid;
  if (!userId) throw new Error("User not authenticated");
  if (!paymentRef) throw new Error("Payment reference is required");
  if (!cart?.items?.length) throw new Error("Cart is empty");
  if (!address?.mobile) throw new Error("Address incomplete");

  const orderId = generateOrderId();

  const order = {
    orderId,
    userId,

    items: cart.items.map(item => ({
      productId: item.productId,
      variantIndex: item.variantIndex,
      slug: item.product.slug,
      title: item.product.name,
      variant: item.product.variants[item.variantIndex],
      qty: item.qty,
      purity: item.product.purity,
    })),

    address,

    payment: {
      method: paymentMethod,
      reference: paymentRef,
    },

    priceSummary,
    createdAt: now(),
  };

  /* ---------------- Persist order ---------------- */

  await ORDERS_KV.put(`order:${orderId}`, JSON.stringify(order));

  /* ---------------- Update user index ---------------- */

  const userOrdersKey = `user:${userId}:orders`;

  const existing =
    (await ORDERS_KV.get(userOrdersKey, "json")) || [];

  if (existing.includes(orderId)) {
    throw new Error("Duplicate order");
  }

  existing.push(orderId);

  await ORDERS_KV.put(userOrdersKey, JSON.stringify(existing));

  return order;
}

export async function getOrdersByUser(request, env, headers) {
  const url = new URL(request.url);

  const userId = url.searchParams.get("uid");

  if (!userId) return [];

  const indexKey = `user:${userId}:orders`;
  const orderIds = await env.ORDERS_KV.get(indexKey, "json");
  console.log(orderIds);

  if (!orderIds?.length) return [];

  const orders = await Promise.all(
    orderIds.map(id =>
      env.ORDERS_KV.get(`order:${id}`, "json")
    )
  );
  const sortedOrders = orders
      .filter(Boolean)
      .sort((a, b) => b.createdAt - a.createdAt);

    // ✅ FIX: Return the response correctly
    return json({ orders: sortedOrders }, 200, headers);
}



/*=============== HELPERS ===============*/
function now() {
  return Date.now();
}

function generateOrderId() {
  return `ORD-${now()}-${Math.floor(Math.random() * 10000)}`;
}
/*=======================================*/

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}