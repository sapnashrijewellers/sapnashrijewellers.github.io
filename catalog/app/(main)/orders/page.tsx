"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { Loader2, Package } from "lucide-react";
import { Order, Product } from "@/types/catalog";
import { useAuth } from "@/context/AuthContext";
import { auth, googleProvider } from "@/utils/firebase";
import { signInWithPopup } from "firebase/auth";
import products from "@/data/products.json";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  //const [products, setProducts] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(true);

  /* ---------------- Auth Enforcement ---------------- */
  useEffect(() => {
    if (!authLoading && !user) {
      signInWithPopup(auth, googleProvider).catch(err =>
        console.error("Auth failed", err)
      );
    }
  }, [authLoading, user]);

  /* ---------------- Fetch Orders ---------------- */
  useEffect(() => {
    if (!user?.uid) return;

    const loadOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WORKER_URL}/orders?uid=${user.uid}`
        );
        const data = await res.json();

        // Drop empty orders defensively
        const validOrders = (data.orders || []).filter(
          (o: Order) => o.items?.length > 0
        );

        setOrders(validOrders);
      } catch (e) {
        console.error("Failed to load orders", e);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?.uid]);



  /* ---------------- UI States ---------------- */
  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-20">Please sign in to view orders.</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 space-y-3">
        <Package size={40} className="mx-auto opacity-60" />
        <p className="text-muted">You haven’t placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-3xl font-yatra">My Orders</h1>

      {orders.map(order => (
        <OrderCard
          key={order.orderId}
          order={order}
          products={products}
        />
      ))}
    </div>
  );
}

/* ---------------- Order Card ---------------- */

function OrderCard({
  order,
  products,
}: {
  order: Order;
  products: Product[];
}) {
  return (
    <div className="border border-theme rounded-xl p-6 space-y-4 bg-surface">
      {/* Header */}
      <div className="flex justify-between flex-wrap gap-2">
        <div>
          <p className="text-sm text-muted">
            Order ID: <span className="font-mono">{order.orderId}</span>
          </p>
          <p className="text-sm text-muted">
            Placed on: {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted">Order Total</p>
          <p className="text-lg font-semibold">
            ₹{order.priceSummary.finalPrice}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {order.items.map((item, i) => {
          const hydrated = products.find(p => p.id == item.productId);

          return (
            <div key={i} className="space-y-2">
              {hydrated ? (
                <>
                  {/* Hydrated Product */}
                  <ProductCard
                    product={hydrated}
                    variant={item.variantIndex}
                  />
                  <p className="text-sm text-muted text-center">
                    Qty: {item.qty}
                  </p>
                </>
              ) : (
                <>
                  {/* Snapshot fallback */}
                  <div className="border border-theme rounded-lg p-4 bg-surface text-center space-y-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted">
                      Qty: {item.qty}
                    </p>
                    <p className="text-xs text-muted">
                      (Product no longer available)
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Address */}
      <div className="border-t border-theme pt-4 space-y-1">
        <h3 className="font-medium">Delivery Address</h3>
        <p>{order.address.name}</p>
        <p className="text-sm text-muted">{order.address.mobile}</p>
        <p className="text-sm whitespace-pre-line">
          {order.address.address}
        </p>
        <p className="text-sm">
          {order.address.city} – {order.address.pin}
        </p>
      </div>
      {/* Payment */}
      <div className="border-t border-theme pt-4 space-y-1">
        <h3 className="font-medium">Payment</h3>
        <p className="text-sm">
          Method: <span className="font-semibold">{order.payment.method}</span>
        </p>

        {order.payment.reference && (
          <p className="text-sm text-muted">
            Reference: {order.payment.reference}
          </p>
        )}
      </div>

      {/* Price Summary */}
      <div className="border-t border-theme pt-4 text-sm space-y-1">
        <div className="flex justify-between">
          <span>Products</span>
          <span>₹{order.priceSummary.productTotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹{order.priceSummary.shipping}</span>
        </div>

        {order.priceSummary.cod > 0 && (
          <div className="flex justify-between">
            <span>COD Charges</span>
            <span>₹{order.priceSummary.cod}</span>
          </div>
        )}

        <div className="flex justify-between font-semibold border-t border-theme pt-2">
          <span>Total Paid</span>
          <span>₹{order.priceSummary.finalPrice}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-theme text-right text-sm">
        <span className="text-muted">You paid:</span>{" "}
        <span className="font-semibold">
          ₹{order.priceSummary.finalPrice}
        </span>
      </div>
    </div>
  );
}

