import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Internal CRM dashboard with customers, leads, and activity overview.",
};

type Customer = {
  id: string;
  name: string;
  email: string;
  company: string;
  status: "active" | "lead" | "inactive";
  source: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: "new" | "contacted" | "qualified" | "won" | "lost";
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

async function getBaseUrl() {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  return host ? `${protocol}://${host}` : "http://localhost:3000";
}

async function fetchDashboardData() {
  const baseUrl = await getBaseUrl();
  const [customersResponse, leadsResponse] = await Promise.all([
    fetch(`${baseUrl}/api/customers`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/leads`, { cache: "no-store" }),
  ]);

  const customersData = customersResponse.ok
    ? ((await customersResponse.json()) as { customers?: Customer[] })
    : { customers: [] };
  const leadsData = leadsResponse.ok
    ? ((await leadsResponse.json()) as { leads?: Lead[] })
    : { leads: [] };

  return {
    customers: customersData.customers ?? [],
    leads: leadsData.leads ?? [],
  };
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusBadge(status: string) {
  return (
    <span className="rounded-full border px-2.5 py-1 text-xs font-medium capitalize">
      {status}
    </span>
  );
}

export default async function DashboardPage() {
  const { customers, leads } = await fetchDashboardData();
  const activeCustomers = customers.filter((customer) => customer.status === "active").length;
  const openLeads = leads.filter((lead) => lead.status !== "won" && lead.status !== "lost").length;
  const latestCustomers = customers.slice(0, 3);
  const latestLeads = leads.slice(0, 3);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Unified CRM</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Monitor customers, pipeline health, and recent activity.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
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

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Customers</p>
            <p className="mt-2 text-3xl font-semibold">{customers.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeCustomers} active customer{activeCustomers === 1 ? "" : "s"}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Leads</p>
            <p className="mt-2 text-3xl font-semibold">{leads.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {openLeads} open lead{openLeads === 1 ? "" : "s"}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Latest customer</p>
            <p className="mt-2 text-lg font-semibold">
              {customers[0]?.name ?? "No customers yet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {customers[0] ? formatDate(customers[0].updatedAt) : "Create a record to get started"}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Latest lead</p>
            <p className="mt-2 text-lg font-semibold">{leads[0]?.name ?? "No leads yet"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {leads[0] ? formatDate(leads[0].updatedAt) : "Create a lead to populate activity"}
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Recent customers</h2>
                <p className="text-sm text-muted-foreground">Latest customer records from the CRM.</p>
              </div>
              <Link href="/dashboard/customers" className="text-sm underline-offset-4 hover:underline">
                View all
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {latestCustomers.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No customers yet. Add the first customer to get started.
                </div>
              ) : (
                latestCustomers.map((customer) => (
                  <article key={customer.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-medium">{customer.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {customer.company} · {customer.email}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {customer.notes || "No notes provided."}
                        </p>
                      </div>
                      {statusBadge(customer.status)}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Updated {formatDate(customer.updatedAt)}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Recent leads</h2>
                <p className="text-sm text-muted-foreground">Pipeline items and qualification progress.</p>
              </div>
              <Link href="/dashboard/leads" className="text-sm underline-offset-4 hover:underline">
                View all
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {latestLeads.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No leads yet. Add a lead to populate the pipeline.
                </div>
              ) : (
                latestLeads.map((lead) => (
                  <article key={lead.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-medium">{lead.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {lead.company} · {lead.email}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {lead.notes || "No notes provided."}
                        </p>
                      </div>
                      {statusBadge(lead.status)}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Updated {formatDate(lead.updatedAt)}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}