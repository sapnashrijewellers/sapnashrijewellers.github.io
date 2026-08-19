"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { Loader2, Package, LogIn, RefreshCw, ShoppingBag } from "lucide-react";
import type { Order, Product } from "@/types/catalog";
import { useAuth } from "@/context/AuthContext";
import productsData from "@/data/products.json";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authPending, setAuthPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // O(1) Fast Lookup Map for Hydrating Catalog Products
  const productsMap = useMemo(() => {
    const map = new Map<number, Product>();
    (productsData as Product[]).forEach((p) => {
      map.set(Number(p.id), p);
    });
    return map;
  }, []);

  /* ---------------- Lazy User Authentication Action ---------------- */
  const handleLogin = useCallback(async () => {
    try {
      setAuthPending(true);
      setError(null);
      const [{ signInWithPopup }, { getFirebaseAuthInstance }] = await Promise.all([
        import("firebase/auth"),
        import("@/utils/firebase"),
      ]);

      const { auth, googleProvider } = await getFirebaseAuthInstance();
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Auth failed:", err);
    } finally {
      setAuthPending(false);
    }
  }, []);

  /* ---------------- Fetch Orders ---------------- */
  const loadOrders = useCallback(async (uid: string) => {
    try {
      setLoading(true);
      setError(null);

      const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || "";
      const res = await fetch(`${workerUrl}/orders?uid=${encodeURIComponent(uid)}`, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to load orders: ${res.status}`);
      }

      const data = await res.json();

      // Defensive filtering for valid orders with items
      const validOrders: Order[] = (data.orders || []).filter(
        (o: Order) => Array.isArray(o.items) && o.items.length > 0
      );

      setOrders(validOrders);
    } catch (e) {
      console.error("Failed to load orders:", e);
      setError("Unable to load orders right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.uid) {
      loadOrders(user.uid);
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user?.uid, authLoading, user, loadOrders]);

  /* ---------------- UI States ---------------- */

  // 1. Initial Loading State (Hydration Stable)
  if (authLoading || (loading && user)) {
    return (
      <main
        aria-busy="true"
        aria-live="polite"
        className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh] space-y-3"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading your orders... (ऑर्डर लोड हो रहे हैं)
        </p>
      </main>
    );
  }

  // 2. Unauthenticated State (Actionable Login CTA)
  if (!user) {
    return (
      <main className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <div className="p-4 rounded-full bg-primary/10 text-primary w-16 h-16 mx-auto flex items-center justify-center">
          <LogIn className="w-8 h-8" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-foreground font-yatra">
            साइन इन करें (Sign In to View Orders)
          </h1>
          <p className="text-sm text-muted-foreground">
            Please sign in with your Google account to access your purchase history and order tracking.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          disabled={authPending}
          aria-label="Sign in with Google to view orders"
          className="
            inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl
            bg-primary text-primary-foreground font-semibold text-sm shadow-sm
            hover:bg-primary/90 hover:scale-[1.02] active:scale-95
            transition-[transform,background-color] duration-150 ease-out will-change-[transform]
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            disabled:opacity-60 disabled:pointer-events-none cursor-pointer
          "
        >
          {authPending ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <LogIn className="w-4 h-4" aria-hidden="true" />
          )}
          <span>{authPending ? "Signing in..." : "Sign in with Google"}</span>
        </button>
      </main>
    );
  }

  // 3. Error Fallback State
  if (error) {
    return (
      <main className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-sm text-destructive">{error}</p>
        <button
          type="button"
          onClick={() => user?.uid && loadOrders(user.uid)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-theme text-sm font-medium hover:bg-theme/10 active:scale-95 transition-transform"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          <span>Try Again</span>
        </button>
      </main>
    );
  }

  // 4. Empty State
  if (orders.length === 0) {
    return (
      <main className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-4 rounded-full bg-surface border border-theme/40 w-16 h-16 mx-auto flex items-center justify-center shadow-xs">
          <Package className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-foreground">
            कोई ऑर्डर नहीं मिला (No Orders Found)
          </h1>
          <p className="text-sm text-muted-foreground">
            You haven’t placed any jewellery orders with us yet.
          </p>
        </div>
        <Link
          href="/"
          className="
            inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
            bg-primary text-primary-foreground font-medium text-sm shadow-sm
            hover:bg-primary/90 hover:scale-[1.02] active:scale-95
            transition-[transform,background-color] duration-150 ease-out will-change-[transform]
          "
        >
          <ShoppingBag className="w-4 h-4" aria-hidden="true" />
          <span>Start Shopping</span>
        </Link>
      </main>
    );
  }

  // 5. Active Orders List
  return (
    <main
      aria-labelledby="orders-page-heading"
      className="max-w-6xl mx-auto px-4 py-8 space-y-8"
    >
      <header className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-theme/20 pb-4 gap-2">
        <h1
          id="orders-page-heading"
          className="text-2xl sm:text-3xl font-bold text-foreground font-yatra tracking-tight"
        >
          मेरे ऑर्डर (My Orders)
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Showing {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </header>

      {/* Screen Reader Summary */}
      <div className="sr-only" aria-live="polite">
        Displaying your order history with detailed product items, delivery addresses, and payment summaries.
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <OrderCard
            key={order.orderId}
            order={order}
            productsMap={productsMap}
          />
        ))}
      </div>
    </main>
  );
}

/* ---------------- Order Card Component ---------------- */

interface OrderCardProps {
  order: Order;
  productsMap: Map<number, Product>;
}

function OrderCard({ order, productsMap }: OrderCardProps) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTotal = Number(
    order.priceSummary?.finalPrice || 0
  ).toLocaleString("en-IN");

  return (
    <article
      aria-label={`Order ${order.orderId}`}
      className="border border-theme/40 rounded-2xl p-4 sm:p-6 space-y-6 bg-surface shadow-xs transition-shadow hover:shadow-sm"
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-theme/20 pb-4">
        <div className="space-y-0.5">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Order ID:{" "}
            <span className="font-mono font-medium text-foreground select-all">
              {order.orderId}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            Placed on:{" "}
            <time dateTime={new Date(order.createdAt).toISOString()}>
              {formattedDate}
            </time>
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs text-muted-foreground">Order Total (कुल राशि)</p>
          <p className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            ₹{formattedTotal}
          </p>
        </div>
      </div>

      {/* Ordered Products Track */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Ordered Items ({order.items.length})
        </h2>

        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 items-stretch">
          {order.items.map((item, i) => {
            const hydrated = productsMap.get(Number(item.productId));

            return (
              <div key={`${order.orderId}-item-${item.productId}-${i}`} className="flex flex-col h-full">
                {hydrated ? (
                  <div className="flex flex-col h-full justify-between space-y-2">
                    <ProductCard product={hydrated} />
                    <span className="text-xs font-medium text-muted-foreground text-center bg-background/80 py-1 px-2 rounded-lg border border-theme/30">
                      Qty: {item.qty}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between h-full border border-theme/40 rounded-2xl p-4 bg-background/50 text-center space-y-2">
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        (Catalog item updated)
                      </p>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground bg-surface py-1 px-2 rounded-lg border border-theme/30">
                      Qty: {item.qty}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Grid: Address, Payment, Price Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-theme/20 text-xs sm:text-sm">
        {/* Delivery Address */}
        <div className="space-y-1.5">
          <h3 className="font-semibold text-foreground">Delivery Address</h3>
          <address className="not-italic text-foreground/80 space-y-0.5 leading-relaxed">
            <p className="font-medium text-foreground">{order.address?.name}</p>
            <p className="text-muted-foreground">{order.address?.mobile}</p>
            <p className="whitespace-pre-line">{order.address?.address}</p>
            <p>
              {order.address?.city}
              {order.address?.pin ? ` – ${order.address.pin}` : ""}
            </p>
          </address>
        </div>

        {/* Payment Summary */}
        <div className="space-y-1.5">
          <h3 className="font-semibold text-foreground">Payment Details</h3>
          <div className="text-foreground/80 space-y-1 leading-relaxed">
            <p>
              Method:{" "}
              <span className="font-semibold text-foreground uppercase">
                {order.payment?.method || "Online"}
              </span>
            </p>
            {order.payment?.reference && (
              <p className="text-muted-foreground break-all">
                Ref: <span className="font-mono text-xs">{order.payment.reference}</span>
              </p>
            )}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 bg-background/60 p-3.5 rounded-xl border border-theme/30">
          <h3 className="font-semibold text-foreground">Price Summary</h3>
          <dl className="space-y-1 text-xs text-foreground/85">
            <div className="flex justify-between">
              <dt>Items Subtotal</dt>
              <dd>₹{Number(order.priceSummary?.productTotal || 0).toLocaleString("en-IN")}</dd>
            </div>

            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>
                {Number(order.priceSummary?.shipping || 0) === 0
                  ? "FREE"
                  : `₹${Number(order.priceSummary?.shipping).toLocaleString("en-IN")}`}
              </dd>
            </div>

            {Number(order.priceSummary?.cod || 0) > 0 && (
              <div className="flex justify-between">
                <dt>COD Charges</dt>
                <dd>₹{Number(order.priceSummary.cod).toLocaleString("en-IN")}</dd>
              </div>
            )}

            <div className="flex justify-between font-bold text-foreground border-t border-theme/20 pt-1.5 text-xs sm:text-sm">
              <dt>Total Amount</dt>
              <dd>₹{formattedTotal}</dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}