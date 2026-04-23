"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Customer = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: "active" | "inactive";
  notes: string;
  createdAt: string;
  updatedAt: string;
};

type CustomerInput = {
  name: string;
  company: string;
  email: string;
  status: Customer["status"];
  notes: string;
};

const emptyForm: CustomerInput = {
  name: "",
  company: "",
  email: "",
  status: "active",
  notes: "",
};

const storageKey = "crm_customers";
const sessionKeys = ["internal-crm-session", "crm_session"];

function readCustomers(): Customer[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Customer[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCustomers(customers: Customer[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(customers));
}

function makeId() {
  return `cust_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function hasValidSession() {
  if (typeof window === "undefined") return false;
  return sessionKeys.some((key) => Boolean(window.localStorage.getItem(key)));
}

export default function CustomersPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState<CustomerInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!hasValidSession()) {
      router.replace("/auth");
      return;
    }

    setCustomers(readCustomers());
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (ready) writeCustomers(customers);
  }, [customers, ready]);

  const filteredCustomers = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter((customer) =>
      [customer.name, customer.company, customer.email, customer.status, customer.notes]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [customers, query]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: Customer = {
      id: editingId ?? makeId(),
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      status: form.status,
      notes: form.notes.trim(),
      createdAt:
        customers.find((customer) => customer.id === editingId)?.createdAt ??
        new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!payload.name || !payload.email) return;

    setCustomers((current) => {
      const next = current.filter((customer) => customer.id !== payload.id);
      return [payload, ...next];
    });
    resetForm();
  }

  function handleEdit(customer: Customer) {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      company: customer.company,
      email: customer.email,
      status: customer.status,
      notes: customer.notes,
    });
  }

  function handleDelete(id: string) {
    setCustomers((current) => current.filter((customer) => customer.id !== id));
    if (editingId === id) resetForm();
  }

  function handleLogout() {
    sessionKeys.forEach((key) => window.localStorage.removeItem(key));
    router.push("/auth");
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading customers...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              <Link href="/dashboard" className="underline-offset-4 hover:underline">
                Dashboard
              </Link>{" "}
              / Customers
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Customers</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Create, edit, and manage customer records for the internal CRM.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard/leads"
              className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
            >
              Leads
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Log out
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit customer" : "Add customer"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {editingId ? "Update the selected customer record." : "Create a new customer record."}
              </p>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">Company</span>
                <input
                  value={form.company}
                  onChange={(e) => setForm((current) => ({ ...current, company: e.target.value }))}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">Status</span>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      status: e.target.value as Customer["status"],
                    }))
                  }
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">Notes</span>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))}
                  rows={5}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                {editingId ? "Save changes" : "Add customer"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
              >
                Reset
              </button>
            </div>
          </form>

          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Customer list</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {filteredCustomers.length} record{filteredCustomers.length === 1 ? "" : "s"} shown
                </p>
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search customers"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring sm:max-w-xs"
              />
            </div>

            <div className="mt-6 space-y-4">
              {filteredCustomers.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No customers yet. Add the first customer to get started.
                </div>
              ) : (
                filteredCustomers.map((customer) => (
                  <article key={customer.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-medium">{customer.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {customer.company || "No company"} · {customer.email}
                        </p>
                        <p className="mt-2 text-sm">{customer.notes || "No notes provided."}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(customer)}
                          className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium hover:bg-accent"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(customer.id)}
                          className="inline-flex h-9 items-center justify-center rounded-md border border-destructive/30 px-3 text-sm font-medium text-destructive hover:bg-destructive/10"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="rounded-full border px-2 py-1 capitalize">{customer.status}</span>
                      <span>Created {new Date(customer.createdAt).toLocaleString()}</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}