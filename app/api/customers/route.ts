export const dynamic = "force-dynamic";

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

type CustomerInput = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  status?: unknown;
  source?: unknown;
  notes?: unknown;
};

const customers: Customer[] = [
  {
    id: "cust_1",
    name: "Ava Thompson",
    email: "ava@northstar.co",
    company: "Northstar Logistics",
    status: "active",
    source: "Referral",
    notes: "Primary contact for enterprise shipping rollout.",
    createdAt: new Date("2024-01-11T09:30:00.000Z").toISOString(),
    updatedAt: new Date("2024-02-18T14:15:00.000Z").toISOString(),
  },
  {
    id: "cust_2",
    name: "Jordan Lee",
    email: "jordan@catalystapp.io",
    company: "Catalyst App",
    status: "lead",
    source: "Website",
    notes: "Interested in a demo for the team tier.",
    createdAt: new Date("2024-03-02T12:00:00.000Z").toISOString(),
    updatedAt: new Date("2024-03-08T08:45:00.000Z").toISOString(),
  },
];

const allowedStatuses: Customer["status"][] = ["active", "lead", "inactive"];

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

function toStringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeCustomer(input: CustomerInput, existing?: Customer): Customer | Response {
  const name = toStringValue(input.name);
  const email = toStringValue(input.email);
  const company = toStringValue(input.company);
  const status = toStringValue(input.status);
  const source = toStringValue(input.source);
  const notes = toStringValue(input.notes);

  if (!name) return json({ error: "Name is required." }, 400);
  if (!email || !isValidEmail(email)) return json({ error: "A valid email is required." }, 400);
  if (!company) return json({ error: "Company is required." }, 400);
  if (!allowedStatuses.includes(status as Customer["status"])) {
    return json({ error: "Status must be active, lead, or inactive." }, 400);
  }

  const now = new Date().toISOString();

  return {
    id: existing?.id ?? `cust_${crypto.randomUUID()}`,
    name,
    email,
    company,
    status: status as Customer["status"],
    source: source || "Manual",
    notes,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

export async function GET() {
  return json({ customers });
}

export async function POST(request: Request) {
  let payload: CustomerInput;

  try {
    payload = (await request.json()) as CustomerInput;
  } catch {
    return json({ error: "Invalid JSON payload." }, 400);
  }

  const normalized = normalizeCustomer(payload);
  if (normalized instanceof Response) return normalized;

  customers.unshift(normalized);
  return json({ customer: normalized }, 201);
}

export async function PUT(request: Request) {
  let payload: CustomerInput & { id?: unknown };

  try {
    payload = (await request.json()) as CustomerInput & { id?: unknown };
  } catch {
    return json({ error: "Invalid JSON payload." }, 400);
  }

  const id = toStringValue(payload.id);
  if (!id) return json({ error: "Customer id is required." }, 400);

  const index = customers.findIndex((customer) => customer.id === id);
  if (index === -1) return json({ error: "Customer not found." }, 404);

  const normalized = normalizeCustomer(payload, customers[index]);
  if (normalized instanceof Response) return normalized;

  customers[index] = normalized;
  return json({ customer: normalized });
}

export async function DELETE(request: Request) {
  let payload: { id?: unknown };

  try {
    payload = (await request.json()) as { id?: unknown };
  } catch {
    return json({ error: "Invalid JSON payload." }, 400);
  }

  const id = toStringValue(payload.id);
  if (!id) return json({ error: "Customer id is required." }, 400);

  const index = customers.findIndex((customer) => customer.id === id);
  if (index === -1) return json({ error: "Customer not found." }, 404);

  const [removed] = customers.splice(index, 1);
  return json({ customer: removed });
}