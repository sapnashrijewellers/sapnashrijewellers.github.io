'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, Package, LogIn, RefreshCw, ShoppingBag } from 'lucide-react';

import OrderedProductCard from '@/components/product/OrderedProductCard';
import { getCachedUser, getIdToken, signInWithGoogle, subscribeAuth, type AuthUserSnapshot } from '@/utils/auth/auth';

import type { Order, Product } from '@/types/catalog';
import productsData from '@/data/products.json';

export default function OrdersPage() {
  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  const [user, setUser] = useState<AuthUserSnapshot | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const uid = user?.uid ?? null;

  // Initialize from the lightweight auth cache.
  //
  // subscribeAuth() then keeps this page synchronized with:
  // - login/logout in this tab
  // - login/logout in another browser tab
  useEffect(() => {
    setUser(getCachedUser());
    setAuthLoading(false);

    return subscribeAuth((nextUser) => {
      setUser(nextUser);
    });
  }, []);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [authPending, setAuthPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --------------------------------------------------
  // Product Lookup
  // --------------------------------------------------

  const productsMap = useMemo(() => {
    const map = new Map<number, Product>();

    (productsData as Product[]).forEach((product) => {
      map.set(Number(product.id), product);
    });

    return map;
  }, []);

  // --------------------------------------------------
  // Sign In
  // --------------------------------------------------

  const handleLogin = useCallback(async () => {
    try {
      setAuthPending(true);
      setError(null);

      await signInWithGoogle();

      // signInWithGoogle() publishes the authentication
      // event through subscribeAuth().
      //
      // The authentication effect above receives the new
      // user and updates `user`, which changes `uid`.
    } catch (error) {
      console.error('Orders sign-in failed:', error);
      setError('Unable to sign in right now. Please try again.');
    } finally {
      setAuthPending(false);
    }
  }, []);

  // --------------------------------------------------
  // Fetch Orders
  // --------------------------------------------------

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setError(null);

    try {
      const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || '';

      const idToken = await getIdToken();

      if (!idToken) {
        throw new Error('Authentication token is unavailable');
      }

      const res = await fetch(`${workerUrl}/api/v1/orders`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to load orders: ${res.status}`);
      }

      const response = await res.json();

      console.log(response);

      const data = response.data;

      const validOrders: Order[] = Array.isArray(data?.orders)
        ? data.orders.filter((order: Order) => Array.isArray(order.items) && order.items.length > 0)
        : [];

      setOrders(validOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);

      setOrders([]);
      setError('Unable to load orders right now. Please try again.');
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // --------------------------------------------------
  // Authentication → Orders
  // --------------------------------------------------

  useEffect(() => {
    if (!uid) {
      setOrders([]);
      setError(null);
      setOrdersLoading(false);
      return;
    }

    void fetchOrders();
  }, [uid, fetchOrders]);

  // --------------------------------------------------
  // Retry
  // --------------------------------------------------

  const handleRetry = useCallback(() => {
    if (!uid) {
      return;
    }

    void fetchOrders();
  }, [uid, fetchOrders]);

  // --------------------------------------------------
  // Authentication Loading
  // --------------------------------------------------

  if (authLoading) {
    return (
      <main
        aria-busy="true"
        aria-live="polite"
        className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center space-y-3 px-4 py-16"
      >
        <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />

        <p className="text-muted-foreground animate-pulse text-sm">Loading your account...</p>
      </main>
    );
  }

  // --------------------------------------------------
  // Not Authenticated
  // --------------------------------------------------

  if (!user) {
    return (
      <main className="mx-auto max-w-md space-y-5 px-4 py-20 text-center">
        <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full p-4">
          <LogIn className="h-8 w-8" aria-hidden="true" />
        </div>

        <div className="space-y-1.5">
          <h2>Sign In to View Orders</h2>

          <p className="text-muted-foreground text-sm">
            Please sign in with your Google account to access your purchase history and order tracking.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          disabled={authPending}
          aria-label="Sign in with Google to view orders"
          className="bg-primary hover:bg-primary/90 focus:ring-primary inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition-[transform,background-color] duration-150 ease-out hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-60"
        >
          {authPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <LogIn className="h-4 w-4" aria-hidden="true" />
          )}

          <span>{authPending ? 'Signing in...' : 'Sign in with Google'}</span>
        </button>
      </main>
    );
  }

  // --------------------------------------------------
  // Orders Loading
  // --------------------------------------------------

  if (ordersLoading) {
    return (
      <main
        aria-busy="true"
        aria-live="polite"
        className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center space-y-3 px-4 py-16"
      >
        <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />

        <p className="text-muted-foreground animate-pulse text-sm">Loading your orders... (ऑर्डर लोड हो रहे हैं)</p>
      </main>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error) {
    return (
      <main className="mx-auto max-w-md space-y-4 px-4 py-20 text-center">
        <p className="text-destructive text-sm">{error}</p>

        <button
          type="button"
          onClick={handleRetry}
          className="bg-surface border-theme hover:bg-theme/10 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-transform active:scale-95"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />

          <span>Try Again</span>
        </button>
      </main>
    );
  }

  // --------------------------------------------------
  // Empty Orders
  // --------------------------------------------------

  if (orders.length === 0) {
    return (
      <main className="mx-auto max-w-md space-y-4 px-4 py-20 text-center">
        <div className="bg-surface border-theme/40 mx-auto flex h-16 w-16 items-center justify-center rounded-full border p-4 shadow-xs">
          <Package className="text-muted-foreground h-8 w-8" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <h2 className="text-foreground text-xl font-bold">No Orders Found</h2>

          <p className="text-muted-foreground text-sm">You haven’t placed any jewellery orders with us yet.</p>
        </div>

        <Link
          href="/"
          title="visit home page for latest updates on product, browse collections..."
          className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium shadow-sm transition-[transform,background-color] duration-150 ease-out hover:scale-[1.02] active:scale-95"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />

          <span>Start Shopping</span>
        </Link>
      </main>
    );
  }

  // --------------------------------------------------
  // Orders
  // --------------------------------------------------

  return (
    <main aria-labelledby="orders-page-heading" className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <header className="border-theme/20 flex flex-col justify-between gap-2 border-b pb-4 sm:flex-row sm:items-baseline">
        <h2 id="orders-page-heading">My Orders</h2>

        <p className="text-muted-foreground text-xs sm:text-sm">
          Showing {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </p>
      </header>

      <div className="sr-only" aria-live="polite">
        Displaying your order history with detailed product items, delivery addresses, and payment summaries.
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <OrderCard key={order.orderId} order={order} productsMap={productsMap} />
        ))}
      </div>
    </main>
  );
}

// ==================================================
// Order Card
// ==================================================

interface OrderCardProps {
  order: Order;
  productsMap: Map<number, Product>;
}

function OrderCard({ order }: OrderCardProps) {
  const createdAt = new Date(order.createdAt);

  const formattedDate = createdAt.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedTotal = Number(order.priceSummary?.finalPrice || 0).toLocaleString('en-IN');

  return (
    <article
      aria-label={`Order ${order.orderId}`}
      className="border-theme/40 bg-surface space-y-6 rounded-2xl border p-4 shadow-xs transition-shadow hover:shadow-sm sm:p-6"
    >
      {/* ---------------------------------------------- */}
      {/* Order Header */}
      {/* ---------------------------------------------- */}

      <div className="border-theme/20 flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
        <div className="space-y-0.5">
          <p className="text-muted-foreground text-xs sm:text-sm">
            Order ID: <span className="text-foreground font-mono font-medium select-all">{order.orderId}</span>
          </p>

          <p className="text-muted-foreground text-xs">
            Placed on: <time dateTime={createdAt.toISOString()}>{formattedDate}</time>
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-muted-foreground text-xs">Order Total</p>

          <p className="text-foreground text-lg font-bold tracking-tight sm:text-xl">₹{formattedTotal}</p>
        </div>
      </div>

      {/* ---------------------------------------------- */}
      {/* Ordered Products */}
      {/* ---------------------------------------------- */}

      <div className="space-y-3">
        <h2 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Ordered Items ({order.items.length})
        </h2>

        <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {order.items.map((item, index) => {
            return (
              <div key={`${order.orderId}-item-${item.product.productId}-${index}`} className="flex h-full flex-col">
                <div className="flex h-full flex-col justify-between space-y-2">
                  <OrderedProductCard product={item.product} />

                  <span className="text-muted-foreground bg-background/80 border-theme/30 rounded-lg border px-2 py-1 text-center text-xs font-medium">
                    Qty: {item.qty}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------- */}
      {/* Order Details */}
      {/* ---------------------------------------------- */}

      <div className="border-theme/20 grid grid-cols-1 gap-6 border-t pt-4 text-xs sm:text-sm md:grid-cols-3">
        {/* Delivery Address */}

        <div className="space-y-1.5">
          <h3 className="text-foreground font-semibold">Delivery Address</h3>

          <address className="text-foreground/80 space-y-0.5 leading-relaxed not-italic">
            <p className="text-foreground font-medium">{order.address?.name}</p>

            <p className="text-muted-foreground">{order.address?.mobile}</p>

            <p className="whitespace-pre-line">{order.address?.address}</p>

            <p>
              {order.address?.city}
              {order.address?.pin ? ` – ${order.address.pin}` : ''}
            </p>
          </address>
        </div>

        {/* Payment Details */}

        <div className="space-y-1.5">
          <h3 className="text-foreground font-semibold">Payment Details</h3>

          <div className="text-foreground/80 space-y-1 leading-relaxed">
            <p>
              Method:{' '}
              <span className="text-foreground font-semibold uppercase">{order.payment?.method || 'Online'}</span>
            </p>

            {order.payment?.reference && (
              <p className="text-muted-foreground break-all">
                Ref: <span className="font-mono text-xs">{order.payment.reference}</span>
              </p>
            )}
          </div>
        </div>

        {/* Price Summary */}

        <div className="bg-background/60 border-theme/30 space-y-2 rounded-xl border p-3.5">
          <h3 className="text-foreground font-semibold">Price Summary</h3>

          <dl className="text-foreground/85 space-y-1 text-xs">
            <div className="flex justify-between">
              <dt>Items Subtotal</dt>

              <dd>₹{Number(order.priceSummary?.productTotal || 0).toLocaleString('en-IN')}</dd>
            </div>

            <div className="flex justify-between">
              <dt>Shipping</dt>

              <dd>
                {Number(order.priceSummary?.shipping || 0) === 0
                  ? 'FREE'
                  : `₹${Number(order.priceSummary?.shipping).toLocaleString('en-IN')}`}
              </dd>
            </div>

            {Number(order.priceSummary?.cod || 0) > 0 && (
              <div className="flex justify-between">
                <dt>COD Charges</dt>

                <dd>₹{Number(order.priceSummary.cod).toLocaleString('en-IN')}</dd>
              </div>
            )}

            <div className="text-foreground border-theme/20 flex justify-between border-t pt-1.5 text-xs font-bold sm:text-sm">
              <dt>Total Amount</dt>
              <dd>₹{formattedTotal}</dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}
