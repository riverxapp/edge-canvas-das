export const runtime = "nodejs";

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

type LeadInput = Omit<Lead, "id" | "createdAt" | "updatedAt">;

const leads = new Map<string, Lead>();

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init);
}

function normalizeString(value: FormDataEntryValue | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function parseLeadInput(payload: unknown): LeadInput | null {
  if (!payload || typeof payload !== "object") return null;

  const record = payload as Partial<Record<keyof LeadInput, unknown>>;
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const company = typeof record.company === "string" ? record.company.trim() : "";
  const email = typeof record.email === "string" ? record.email.trim() : "";
  const status = record.status;

  if (!name || !company || !email) return null;
  if (
    status !== "new" &&
    status !== "contacted" &&
    status !== "qualified" &&
    status !== "won" &&
    status !== "lost"
  ) {
    return null;
  }

  return {
    name,
    company,
    email,
    status,
    notes: typeof record.notes === "string" ? record.notes.trim() : "",
  };
}

function seedLeads() {
  if (leads.size > 0) return;
  const now = new Date().toISOString();

  [
    {
      name: "Taylor Reed",
      company: "Northwind Labs",
      email: "taylor@northwind.example",
      status: "contacted" as const,
      notes: "Requested product demo next week.",
    },
    {
      name: "Morgan Shah",
      company: "Blue Peak Studio",
      email: "morgan@bluepeak.example",
      status: "qualified" as const,
      notes: "Looking for team rollout in Q3.",
    },
  ].forEach((lead, index) => {
    const id = `lead-${index + 1}`;
    leads.set(id, {
      id,
      ...lead,
      createdAt: now,
      updatedAt: now,
    });
  });
}

seedLeads();

export async function GET() {
  const data = Array.from(leads.values()).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
  return json({ leads: data });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  let payload: LeadInput | null = null;

  if (contentType.includes("application/json")) {
    payload = parseLeadInput(await request.json().catch(() => null));
  } else {
    const formData = await request.formData().catch(() => null);
    if (formData) {
      payload = parseLeadInput({
        name: normalizeString(formData.get("name")),
        company: normalizeString(formData.get("company")),
        email: normalizeString(formData.get("email")),
        status: normalizeString(formData.get("status")),
        notes: normalizeString(formData.get("notes")),
      });
    }
  }

  if (!payload) {
    return json({ error: "Invalid lead data." }, { status: 400 });
  }

  const id = `lead-${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const lead: Lead = {
    id,
    ...payload,
    createdAt: now,
    updatedAt: now,
  };

  leads.set(id, lead);

  return json({ lead }, { status: 201 });
}

export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") ?? "";
  const existing = leads.get(id);

  if (!existing) {
    return json({ error: "Lead not found." }, { status: 404 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  let payload: Partial<LeadInput> | null = null;

  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => null);
    if (body && typeof body === "object") {
      const record = body as Partial<Record<keyof LeadInput, unknown>>;
      payload = {
        name: typeof record.name === "string" ? record.name.trim() : existing.name,
        company:
          typeof record.company === "string" ? record.company.trim() : existing.company,
        email: typeof record.email === "string" ? record.email.trim() : existing.email,
        status:
          record.status === "new" ||
          record.status === "contacted" ||
          record.status === "qualified" ||
          record.status === "won" ||
          record.status === "lost"
            ? record.status
            : existing.status,
        notes: typeof record.notes === "string" ? record.notes.trim() : existing.notes ?? "",
      };
    }
  } else {
    const formData = await request.formData().catch(() => null);
    if (formData) {
      payload = {
        name: normalizeString(formData.get("name")) || existing.name,
        company: normalizeString(formData.get("company")) || existing.company,
        email: normalizeString(formData.get("email")) || existing.email,
        status:
          normalizeString(formData.get("status")) === "new" ||
          normalizeString(formData.get("status")) === "contacted" ||
          normalizeString(formData.get("status")) === "qualified" ||
          normalizeString(formData.get("status")) === "won" ||
          normalizeString(formData.get("status")) === "lost"
            ? (normalizeString(formData.get("status")) as Lead["status"])
            : existing.status,
        notes: normalizeString(formData.get("notes")) || existing.notes || "",
      };
    }
  }

  if (!payload) {
    return json({ error: "Invalid lead data." }, { status: 400 });
  }

  const updated: Lead = {
    ...existing,
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  leads.set(id, updated);

  return json({ lead: updated });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") ?? "";

  if (!id || !leads.has(id)) {
    return json({ error: "Lead not found." }, { status: 404 });
  }

  leads.delete(id);

  return json({ ok: true });
}