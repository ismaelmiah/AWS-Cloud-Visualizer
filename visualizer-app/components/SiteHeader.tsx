"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

export function SiteHeader() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/"
            className="font-sans text-sm font-semibold tracking-tight text-zinc-100 transition hover:text-white"
          >
            AWS<span className="text-orange-400">Visualizer</span>
          </Link>
          {isLoaded && isSignedIn ? (
            <Link
              href="/preparation/architect"
              className="hidden text-sm font-medium text-zinc-400 transition hover:text-orange-300/90 sm:inline"
            >
              Arch lab
            </Link>
          ) : null}
        </div>

        <div className="flex min-h-[2.25rem] items-center justify-end gap-2 sm:gap-3">
          {!isLoaded ? (
            <div
              className="h-9 w-28 max-w-full animate-pulse rounded-full bg-white/10"
              aria-hidden
            />
          ) : isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 ring-2 ring-white/10",
                },
              }}
            />
          ) : (
            <>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="rounded-full px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white sm:px-4"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-md shadow-orange-900/30 transition hover:shadow-orange-500/25"
                >
                  Sign up
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
