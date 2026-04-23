import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Internal CRM</h1>
        <p className="max-w-xl text-muted-foreground">
          Access the authenticated dashboard to manage customers and leads.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="/auth" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
            Sign in
          </a>
          <a href="/dashboard" className="rounded-md border border-border px-4 py-2">
            Go to dashboard
          </a>
        </div>
      </main>
    </div>);}