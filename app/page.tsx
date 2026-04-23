 "use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = Boolean(
      window.localStorage.getItem("internal-crm-session"),
    );
    if (isAuthenticated) router.replace("/dashboard");
  }, [router]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <section className="w-full max-w-3xl rounded-xl border bg-card p-8 shadow-sm">
          <div className="space-y-4 text-center">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Internal CRM
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome to the CRM workspace
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Access the authenticated dashboard to manage customers, leads, and the rest of the workspace features.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth"
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md border border-border px-4 py-2"
            >
              Go to dashboard
            </Link>
            <Link
              href="/dashboard/customers"
              className="rounded-md border border-border px-4 py-2"
            >
              Customers
            </Link>
            <Link
              href="/dashboard/leads"
              className="rounded-md border border-border px-4 py-2"
            >
              Leads
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}