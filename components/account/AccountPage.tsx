'use client';

import { useEffect, useState } from 'react';
import { Loader2, MapPin, UserRound } from 'lucide-react';

import { getCurrentUser, type AuthUserSnapshot, getCachedUser } from '@/utils/auth/auth';
import { Address } from '@/types/catalog';

//const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || '';
const workerUrl = 'https://tight-sky-9fb5.ssjn.workers.dev';

export default function AccountPageClient() {
  const [user, setUser] = useState<AuthUserSnapshot | null>(null);
  const [address, setAddress] = useState<Address | null>(null);

  const [loading, setLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAccount() {
      try {
        setLoading(true);
        setError(null);

        /*
         * Use cached user first so the page can render basic
         * information immediately while Firebase initializes.
         */
        const cachedUser = getCachedUser();

        if (cachedUser && !cancelled) {
          setUser(cachedUser);
        }

        /*
         * Firebase remains the source of truth.
         */
        const firebaseUser = await getCurrentUser();

        if (!firebaseUser) {
          /*
           * No authenticated user.
           *
           * Depending on your desired UX, you could redirect here
           * instead of showing this message.
           */
          if (!cancelled) {
            setUser(null);
            setLoading(false);
          }

          return;
        }

        const snapshot: AuthUserSnapshot = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };

        if (!cancelled) {
          setUser(snapshot);
        }

        if (cancelled) return;

        setAddressLoading(true);

        const response = await fetch(`${workerUrl}/address?uid=${encodeURIComponent(firebaseUser.uid)}`, {
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Unable to load address (${response.status})`);
        }

        const data: Address = await response.json();

        if (!cancelled) {
          setAddress(data ?? null);
        }
      } catch (err) {
        console.error('Failed to load account:', err);

        if (!cancelled) {
          setError('Unable to load your profile. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setAddressLoading(false);
        }
      }
    }

    loadAccount();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Initial authentication/loading state.
   */
  if (loading) {
    return (
      <main className="min-h-[60vh] bg-white px-4 py-10 text-gray-900">
        <div className="mx-auto flex max-w-2xl items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-500" />
        </div>
      </main>
    );
  }

  /*
   * Authentication is required for this page.
   */
  if (!user) {
    return (
      <main className="min-h-[60vh] bg-white px-4 py-10 text-gray-900">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
            <UserRound size={32} className="mx-auto mb-3 text-gray-400" />

            <h1 className="text-xl font-semibold">Sign in to view your account</h1>

            <p className="mt-2 text-sm text-gray-500">Please sign in to view your profile and delivery address.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] bg-white px-4 py-8 text-gray-900">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">My Account</h1>

          <p className="mt-1 text-sm text-gray-500">Your account information and delivery details.</p>
        </div>

        {/* Basic Profile */}
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="text-base font-semibold">Profile</h2>

          <div className="mt-4 flex items-center gap-4">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="h-12 w-12 rounded-full" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <UserRound size={22} className="text-gray-500" />
              </div>
            )}

            <div className="min-w-0">
              <p className="font-medium">{user.displayName || 'Customer'}</p>

              {user.email && <p className="mt-0.5 truncate text-sm text-gray-500">{user.email}</p>}
            </div>
          </div>
        </section>

        {/* Address */}
        <section className="mt-5 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-gray-600" />

            <h2 className="text-base font-semibold">Delivery Address</h2>
          </div>

          {addressLoading ? (
            <div className="flex items-center gap-2 py-8 text-sm text-gray-500">
              <Loader2 size={18} className="animate-spin" />
              Loading your address...
            </div>
          ) : error ? (
            <div className="py-6">
              <p className="text-sm text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 text-sm font-medium underline"
              >
                Try again
              </button>
            </div>
          ) : !address ? (
            <div className="py-6">
              <p className="font-medium">Complete your profile with your first order</p>

              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                Your delivery address will be available here after you place your first order.
              </p>
            </div>
          ) : (
            <div className="mt-4 text-sm leading-6">
              {address.name && <p className="font-medium">{address.name}</p>}

              {address.address && <p className="text-gray-700">{address.address}</p>}

              {(address.city || address.pin) && (
                <p className="text-gray-700">
                  {address.city}
                  {address.city && address.pin ? ' – ' : ''}
                  {address.pin}
                </p>
              )}

              {address.mobile && <p className="mt-2 text-gray-700">📞 {address.mobile}</p>}

              {address.email && <p className="text-gray-500">{address.email}</p>}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
