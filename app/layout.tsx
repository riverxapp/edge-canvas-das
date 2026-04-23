import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Unified CRM",
    template: "%s | Unified CRM",
  },
  description: "Internal CRM app for managing customers and leads.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} min-h-full bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <header className="border-b bg-background/95 backdrop-blur">
              <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <Link href="/" className="text-sm font-semibold tracking-tight">
                  Unified CRM
                </Link>
                <nav className="flex items-center gap-2 text-sm">
                  <Link
                    href="/dashboard"
                    className="rounded-md px-3 py-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/customers"
                    className="rounded-md px-3 py-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                  >
                    Customers
                  </Link>
                  <Link
                    href="/dashboard/leads"
                    className="rounded-md px-3 py-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                  >
                    Leads
                  </Link>
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}