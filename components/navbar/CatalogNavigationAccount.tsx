'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

import Link from 'next/link';

import { AppIconMap } from '@/utils/appIcons';
import { getCachedUser, signInWithGoogle, signOutUser, subscribeAuth, type AuthUserSnapshot } from '@/utils/auth/auth';

interface CatalogNavigationAccountProps {
  mobile?: boolean;
}

/**
 * SSR-safe auth snapshot.
 *
 * Server always sees null.
 * Browser sees the cached auth state after hydration.
 *
 * Firebase is NOT initialized here.
 */
function useAuthSnapshot(): AuthUserSnapshot | null {
  const subscribe = useCallback((callback: () => void) => subscribeAuth(() => callback()), []);

  return useSyncExternalStore(subscribe, getCachedUser, () => null);
}

export default function CatalogNavigationAccount({ mobile = false }: CatalogNavigationAccountProps) {
  const user = useAuthSnapshot();

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  /*
   * Close when clicking outside.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (target instanceof Node && !containerRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [open]);

  /*
   * Close with Escape.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  /*
   * Sign in.
   *
   * Firebase is lazy-loaded by signInWithGoogle().
   */
  const handleSignIn = async () => {
    if (busy) {
      return;
    }

    setBusy(true);

    try {
      await signInWithGoogle();
      setOpen(false);
    } catch (error) {
      console.error('Unable to sign in:', error);
    } finally {
      setBusy(false);
    }
  };

  /*
   * Sign out.
   *
   * Firebase is lazy-loaded by signOutUser().
   */
  const handleSignOut = async () => {
    if (busy) {
      return;
    }

    setBusy(true);

    try {
      await signOutUser();
      setOpen(false);
    } catch (error) {
      console.error('Unable to sign out:', error);
    } finally {
      setBusy(false);
    }
  };

  const UserIcon = AppIconMap.User;
  const LogInIcon = AppIconMap.LogIn;
  const LogOutIcon = AppIconMap.LogOut;
  const ClipboardIcon = AppIconMap.ClipboardList;

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={user ? 'Open account menu' : 'Open sign in menu'}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        disabled={busy}
        className={
          mobile
            ? 'flex h-10 w-10 items-center justify-center rounded-full transition disabled:opacity-50'
            : 'group/utility flex items-center gap-2 rounded-full px-3 py-2 text-sm transition disabled:opacity-50'
        }
      >
        {user ? (
          <UserIcon
            className={
              mobile ? 'h-[19px] w-[19px]' : 'h-[18px] w-[18px] transition-transform group-hover/utility:scale-105'
            }
            aria-hidden="true"
          />
        ) : (
          <LogInIcon
            className={
              mobile ? 'h-[19px] w-[19px]' : 'h-[18px] w-[18px] transition-transform group-hover/utility:scale-105'
            }
            aria-hidden="true"
          />
        )}

        <span className="hidden xl:inline">Account</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account menu"
          className={
            mobile
              ? 'absolute top-full right-0 z-[60] mt-2 w-52 rounded-xl border border-black/[0.08] bg-white p-1.5 shadow-lg'
              : 'absolute top-full right-0 z-[60] mt-2 w-52 rounded-xl border border-black/[0.08] bg-white p-1.5 shadow-lg'
          }
        >
          {!user ? (
            <button
              type="button"
              role="menuitem"
              onClick={handleSignIn}
              disabled={busy}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-black/[0.04] disabled:opacity-50"
            >
              <LogInIcon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />

              <span>{busy ? 'Signing in…' : 'Sign In'}</span>
            </button>
          ) : (
            <>
              <Link
                href="/account/"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-black/[0.04]"
              >
                <UserIcon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />

                <span>Profile</span>
              </Link>

              <Link
                href="/orders/"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-black/[0.04]"
              >
                <ClipboardIcon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />

                <span>Orders</span>
              </Link>

              <div className="my-1.5 border-t border-black/[0.08]" aria-hidden="true" />

              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                disabled={busy}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-black/60 transition hover:bg-black/[0.04] hover:text-black disabled:opacity-50"
              >
                <LogOutIcon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />

                <span>{busy ? 'Signing out…' : 'Sign Out'}</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
