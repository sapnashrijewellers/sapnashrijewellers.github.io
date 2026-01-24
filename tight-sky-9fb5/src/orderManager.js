/**
 * ORDER MANAGER
 * Cloudflare Workers + KV
 *
 * KV STRUCTURE (ORDERS_KV):
 * Key   : userId
 * Value : {
 *   orders: {
 *     [orderId]: {
 *       orderId,
 *       userId,
 *       items: [ { productId, variantIndex, snapshot } ],
 *       priceSnapshot,
 *       status: "PAYMENT_PENDING" | "PAID" | "EXPIRED" | "CANCELLED",
 *       createdAt,
 *       expiresAt
 *     }
 *   }
 * }
 */

const ORDER_TTL_MINUTES = 15;

/* -----------------------------
   HELPERS
--------------------------------*/

function now() {
  return Date.now();
}

function generateOrderId() {
  return `ORD-${now()}-${Math.floor(Math.random() * 10000)}`;
}

function isExpired(order) {
  return now() > order.expiresAt;
}

/* -----------------------------
   LOAD / SAVE
--------------------------------*/

async function loadOrders(ORDERS_KV, userId) {
  const data = await ORDERS_KV.get(userId, "json");
  return data?.orders ?? {};
}

async function saveOrders(ORDERS_KV, userId, orders) {
  await ORDERS_KV.put(
    userId,
    JSON.stringify({ orders })
  );
}

/* -----------------------------
   CREATE ORDER (checkout init)
--------------------------------*/

export async function createOrder({
  ORDERS_KV,
  userId,
  items,               // [{ productId, variantIndex, snapshot }]
  priceSnapshot        // final locked price
}) {
  const orders = await loadOrders(ORDERS_KV, userId);

  const orderId = generateOrderId();
  const createdAt = now();

  orders[orderId] = {
    orderId,
    userId,
    items,
    priceSnapshot,
    status: "PAYMENT_PENDING",
    createdAt,
    expiresAt: createdAt + ORDER_TTL_MINUTES * 60 * 1000
  };

  await saveOrders(ORDERS_KV, userId, orders);

  return orders[orderId];
}

/* -----------------------------
   GET ACTIVE ORDERS
--------------------------------*/

export async function getActiveOrders({ ORDERS_KV, userId }) {
  const orders = await loadOrders(ORDERS_KV, userId);

  return Object.values(orders).filter(
    o => o.status === "PAYMENT_PENDING" && !isExpired(o)
  );
}

/* -----------------------------
   GET SINGLE ORDER (secure)
--------------------------------*/

export async function getOrder({
  ORDERS_KV,
  userId,
  orderId
}) {
  const orders = await loadOrders(ORDERS_KV, userId);
  const order = orders[orderId];

  if (!order) return null;
  if (order.userId !== userId) return null;

  if (isExpired(order)) {
    order.status = "EXPIRED";
    await saveOrders(ORDERS_KV, userId, orders);
    return null;
  }

  return order;
}

/* -----------------------------
   MARK ORDER PAID
--------------------------------*/

export async function markOrderPaid({
  ORDERS_KV,
  userId,
  orderId,
  paymentRef
}) {
  const orders = await loadOrders(ORDERS_KV, userId);
  const order = orders[orderId];

  if (!order) throw new Error("Order not found");
  if (isExpired(order)) throw new Error("Order expired");

  order.status = "PAID";
  order.paymentRef = paymentRef;
  order.paidAt = now();

  await saveOrders(ORDERS_KV, userId, orders);

  return order;
}

/* -----------------------------
   CANCEL ORDER (manual discard)
--------------------------------*/

export async function cancelOrder({
  ORDERS_KV,
  userId,
  orderId
}) {
  const orders = await loadOrders(ORDERS_KV, userId);
  const order = orders[orderId];

  if (!order) return;

  order.status = "CANCELLED";
  await saveOrders(ORDERS_KV, userId, orders);
}

/* -----------------------------
   CLEANUP EXPIRED ORDERS
   (call on login / cron / checkout load)
--------------------------------*/

export async function cleanupExpiredOrders({
  ORDERS_KV,
  userId
}) {
  const orders = await loadOrders(ORDERS_KV, userId);
  let changed = false;

  for (const o of Object.values(orders)) {
    if (o.status === "PAYMENT_PENDING" && isExpired(o)) {
      o.status = "EXPIRED";
      changed = true;
    }
  }

  if (changed) {
    await saveOrders(ORDERS_KV, userId, orders);
  }
}
