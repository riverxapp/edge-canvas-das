"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  LineChart,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const highlights = [
  {
    title: "Customer records",
    description: "Keep accounts, contact details, and notes organized in one place.",
    icon: Users,
  },
  {
    title: "Lead pipeline",
    description: "Track opportunities through qualification stages and next steps.",
    icon: LineChart,
  },
  {
    title: "Workspace dashboard",
    description: "Review activity, surface priorities, and move faster with a clean overview.",
    icon: LayoutDashboard,
  },
];

const benefits = [
  "Professional, consistent UI across the app",
  "Accessible shadcn-based controls and spacing",
  "Fast access to dashboard, customers, and leads",
  "Session-aware routing for authenticated users",
];

const stats = [
  { label: "Secure access", value: "Session-aware" },
  { label: "Navigation", value: "Shared routes" },
  { label: "UI system", value: "shadcn components" },
];

const quickLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/customers", label: "Customers" },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/features", label: "Features" },
];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session =
      window.localStorage.getItem("internal-crm-session") ??
      window.localStorage.getItem("crm_session") ??
      window.localStorage.getItem("crm-session");

    if (session) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex flex-1">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <section className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
                Internal CRM
              </Badge>

              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  A polished workspace for customer and lead management.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  A professional, responsive CRM experience built with reusable shadcn
                  components, clear navigation, and a focused dashboard workflow.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild className="h-11 rounded-md px-5">
                  <Link href="/auth">
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 rounded-md px-5">
                  <Link href="/dashboard">Open dashboard</Link>
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-sm"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm leading-6 text-muted-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/60" />
              <div className="space-y-2 pt-2">
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Workspace overview
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Everything in one clean shell
                </h2>
                <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                  Designed to feel modern, readable, and ready for day-to-day CRM work.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article
                      key={item.title}
                      className="flex items-start gap-4 rounded-xl border border-border bg-background/60 p-4"
                    >
                      <div className="shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-foreground">{item.title}</h3>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-foreground">Quick access</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  {quickLinks.map((link, index) => (
                    <Button
                      key={link.href}
                      asChild
                      variant={index === 0 ? "secondary" : "outline"}
                      size="sm"
                      className="rounded-md"
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}