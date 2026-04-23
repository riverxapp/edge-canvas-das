import Link from "next/link";

export const metadata = {
  title: "Main | CRM",
  description: "Internal CRM main entry page.",
};

export default function MainPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <section className="w-full max-w-3xl rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Internal CRM
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome to the CRM workspace
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            Access the authenticated dashboard to manage customers and leads,
            or sign in to continue.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auth"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Open dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}