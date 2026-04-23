"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Lead = {
  id: string;
  name: string;
  company: string;
  status: string;
  value: string;
  email: string;
};

const emptyLead: Omit<Lead, "id"> = {
  name: "",
  company: "",
  status: "New",
  value: "",
  email: "",
};

const statusOptions = ["New", "Working", "Qualified", "Won", "Lost"];

const SESSION_KEYS = ["internal-crm-session", "crm_session", "crm-session"];

function hasSession() {
  if (typeof window === "undefined") return false;
  return SESSION_KEYS.some((key) => Boolean(window.localStorage.getItem(key)));
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [form, setForm] = useState<Omit<Lead, "id">>(emptyLead);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => (editingId ? "Edit lead" : "Add lead"), [editingId]);

  useEffect(() => {
    if (!hasSession()) {
      router.replace("/auth");
      return;
    }

    const loadLeads = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/leads", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load leads.");
        }

        const data = (await response.json()) as { leads: Lead[] };
        setLeads(data.leads ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, [router]);

  const resetForm = () => {
    setForm(emptyLead);
    setEditingId(null);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...form,
        value: form.value.trim(),
      };

      const response = await fetch("/api/leads", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(editingId ? { id: editingId } : {}),
          ...payload,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save lead.");
      }

      const data = (await response.json()) as { lead: Lead };
      setLeads((current) =>
        editingId
          ? current.map((lead) => (lead.id === data.lead.id ? data.lead : lead))
          : [data.lead, ...current],
      );
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setForm({
      name: lead.name,
      company: lead.company,
      status: lead.status,
      value: lead.value,
      email: lead.email,
    });
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/leads?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setError("Unable to delete lead.");
      return;
    }

    setLeads((current) => current.filter((lead) => lead.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Internal CRM
              </p>
              <h1 className="text-3xl font-semibold">Leads</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Track prospects, deal value, and qualification status in one place.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard/customers")}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Customers
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">
                Capture lead details and update qualification as the pipeline progresses.
              </p>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Name</span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">Company</span>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      company: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">Email</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">Status</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">Deal value</span>
                <input
                  type="text"
                  required
                  value={form.value}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      value: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>

            {error ? (
              <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Update lead" : "Create lead"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Pipeline</h2>
                <p className="text-sm text-muted-foreground">
                  {loading
                    ? "Loading leads..."
                    : `${leads.length} lead${leads.length === 1 ? "" : "s"} in pipeline`}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-md border border-border">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Lead</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Company</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Value</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="bg-background">
                      <td className="px-4 py-3">
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-muted-foreground">{lead.email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">{lead.company}</td>
                      <td className="px-4 py-3 text-sm">{lead.status}</td>
                      <td className="px-4 py-3 text-sm">{lead.value}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(lead)}
                            className="rounded-md border border-border px-3 py-1.5 text-sm transition hover:bg-muted"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(lead.id)}
                            className="rounded-md border border-border px-3 py-1.5 text-sm text-destructive transition hover:bg-destructive/10"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && leads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                        No leads yet. Add one to get started.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}