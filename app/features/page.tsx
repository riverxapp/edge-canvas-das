import Link from "next/link";

export const metadata = {
  title: "Features | CRM",
  description: "Explore the CRM feature set.",
};

const features = [
  {
    title: "Customer management",
    description:
      "Create, edit, search, and organize customer records with status, source, and notes.",
  },
  {
    title: "Lead pipeline",
    description:
      "Track prospects through qualification stages with sortable API-backed lead data.",
  },
  {
    title: "Session-aware access",
    description:
      "Protect internal surfaces behind a lightweight authentication flow and redirect logic.",
  },
  {
    title: "Responsive dashboard shell",
    description:
      "Use a clean app layout with shared navigation, cards, and accessible controls.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              <Link href="/" className="underline-offset-4 hover:underline">
                Home
              </Link>{" "}
              / Features
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              CRM features
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              The dashboard includes the core tools needed to manage customers
              and leads without leaving the app.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Open dashboard
            </Link>
            <Link
              href="/dashboard/customers"
              className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
            >
              Customers
            </Link>
            <Link
              href="/dashboard/leads"
              className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
            >
              Leads
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">What’s included</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Everything required to keep the dashboard useful is already
                wired into the app routes.
              </p>
            </div>
            <Link
              href="/auth"
              className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
            >
              Sign in
            </Link>
          </div>

          <ul className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="rounded-lg border p-4">Customer CRUD and search</li>
            <li className="rounded-lg border p-4">Lead CRUD and pipeline view</li>
            <li className="rounded-lg border p-4">Authenticated dashboard access</li>
            <li className="rounded-lg border p-4">Shared navigation and layout</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
