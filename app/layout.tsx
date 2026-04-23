import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  LineChart,
  Search,
  ShieldCheck,
  LayoutDashboard,
  Users,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore the CRM feature set.",
};

const featureHighlights = [
  {
    title: "Customer management",
    description:
      "Create, edit, search, and organize customer records with status, source, and notes.",
    icon: Users,
  },
  {
    title: "Lead pipeline",
    description:
      "Track prospects through qualification stages with API-backed lead data and clear actions.",
    icon: LineChart,
  },
  {
    title: "Session-aware access",
    description:
      "Protect internal surfaces behind a lightweight authentication flow and redirect logic.",
    icon: ShieldCheck,
  },
  {
    title: "Responsive dashboard shell",
    description:
      "Use a clean app layout with shared navigation, cards, and accessible controls.",
    icon: LayoutDashboard,
  },
];

const capabilities = [
  "Responsive layout that adapts across mobile, tablet, and desktop",
  "Shadcn UI cards, badges, buttons, and separators for consistent styling",
  "Clear route entry points for dashboard, customers, leads, and auth",
  "Accessible spacing, typography, and hierarchy for scannable content",
];

const sections = [
  {
    title: "Core workflows",
    description:
      "The app is centered around daily CRM operations, from onboarding to ongoing account management.",
    items: ["Customer CRUD and search", "Lead CRUD and pipeline view", "Authenticated dashboard access"],
  },
  {
    title: "Design system",
    description:
      "The interface uses shadcn-style components and utility classes to stay cohesive and easy to extend.",
    items: ["Cards and separators", "Primary and secondary actions", "Responsive, readable content blocks"],
  },
  {
    title: "Navigation",
    description:
      "Relevant surfaces are linked together so users can move between overview and working areas quickly.",
    items: ["Home and features entry points", "Dashboard shortcuts", "Customers and leads routes"],
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <section className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
          <div className="space-y-6">
            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Feature showcase
            </Badge>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                A polished landing page that showcases the CRM feature set.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Explore the product surface area, navigation, and workspace capabilities in a
                responsive, shadcn-powered layout built for the existing Next.js app.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-11 rounded-md px-5">
                <Link href="/dashboard">
                  Open dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-md px-5">
                <Link href="/auth">Sign in</Link>
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-3 sm:grid-cols-2">
              {capabilities.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/60" />
            <CardHeader className="pt-6">
              <CardDescription className="uppercase tracking-wide">Workspace snapshot</CardDescription>
              <CardTitle className="text-2xl">Everything needed to run the CRM day to day</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {featureHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="flex items-start gap-4 rounded-xl border border-border bg-background/60 p-4"
                  >
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="font-medium text-foreground">{item.title}</h2>
                      <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                  </article>
                );
              })}

              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-foreground">Fast access</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <Button asChild variant="secondary" size="sm" className="rounded-md">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="rounded-md">
                    <Link href="/dashboard/customers">Customers</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="rounded-md">
                    <Link href="/dashboard/leads">Leads</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workflow</CardTitle>
              <CardDescription>Built around the customer and lead lifecycle.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sections[0].items.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">UI system</CardTitle>
              <CardDescription>Consistent shadcn components and spacing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sections[1].items.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Routes</CardTitle>
              <CardDescription>Key areas are linked for easy navigation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sections[2].items.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Feature coverage</CardTitle>
              <CardDescription>High-level capabilities included in the workspace.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {featureHighlights.map((feature) => (
                <article key={feature.title} className="rounded-xl border p-4">
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What&apos;s included</CardTitle>
              <CardDescription>The core app surfaces that support the CRM experience.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 sm:grid-cols-2">
                {sections.flatMap((section) => section.items).map((item) => (
                  <li key={item} className="rounded-lg border p-4 text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}