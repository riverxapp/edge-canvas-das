"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type SessionUser = {
  email: string;
};

const SESSION_KEY = "internal-crm-session";
const LEGACY_SESSION_KEY = "crm_session";
const DEFAULT_EMAIL = "internal@company.com";
const DEFAULT_PASSWORD = "crm1234";

function readSession(): SessionUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw =
      window.localStorage.getItem(SESSION_KEY) ??
      window.localStorage.getItem(LEGACY_SESSION_KEY);

    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

function saveSession(user: SessionUser) {
  const serialized = JSON.stringify(user);
  window.localStorage.setItem(SESSION_KEY, serialized);
  window.localStorage.setItem(LEGACY_SESSION_KEY, serialized);
}

function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(LEGACY_SESSION_KEY);
}

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = useMemo(
    () => searchParams.get("redirectTo") || "/dashboard",
    [searchParams],
  );

  useEffect(() => {
    const session = readSession();
    if (session) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    window.setTimeout(() => {
      if (email.trim().toLowerCase() !== DEFAULT_EMAIL || password !== DEFAULT_PASSWORD) {
        setError("Invalid credentials. Use the internal access account to continue.");
        setLoading(false);
        return;
      }

      saveSession({ email: DEFAULT_EMAIL });
      router.replace(redirectTo);
      router.refresh();
    }, 350);
  }

  function handleLogout() {
    clearSession();
    setEmail(DEFAULT_EMAIL);
    setPassword(DEFAULT_PASSWORD);
    setError("");
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border bg-background p-8 shadow-sm">
        <div className="mb-6 space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Internal CRM
          </p>
          <h1 className="text-2xl font-semibold">Sign in to continue</h1>
          <p className="text-sm text-muted-foreground">
            Access the customer and lead workspace with your internal account.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link className="text-muted-foreground underline-offset-4 hover:underline" href="/">
            Back to home
          </Link>
          <button
            type="button"
            className="text-muted-foreground underline-offset-4 hover:underline"
            onClick={handleLogout}
          >
            Clear session
          </button>
        </div>
      </div>
    </div>
  );
}