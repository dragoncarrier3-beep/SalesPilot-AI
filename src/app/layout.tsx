import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { AppShell } from "@/components/AppShell";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "SalesPilot AI — Sales Copilot",
  description:
    "AI-powered sales copilot for meeting prep, transcript analysis, objection detection, and next-best actions.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${outfit.variable} antialiased`}>
        <style>{`
          :root {
            --font-sans: var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif;
            --font-display: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;
          }
          body { font-family: var(--font-sans); }
          .font-display { font-family: var(--font-display); }
        `}</style>
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
