import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { getSiteOrigin } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteOrigin(),
  title: "Kaya",
  description: "Kaya's blog and terminal-style tools for Web3, development, and fast browser utilities.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/apple-icon" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#02040a] text-[#f5f5f5]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#02040a] text-[#f5f5f5]`}
      >
        <header className="border-b border-[var(--terminal-border)]">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3 sm:px-10">
            <Link href="/" className="text-sm font-mono terminal-accent">{"$> Kaya"}</Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/tools" className="underline-offset-2 hover:underline">Tools</Link>
              <Link href="/search" className="underline-offset-2 hover:underline">Search</Link>
              <Link href="/privacy" className="underline-offset-2 hover:underline">Privacy</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl px-0 pb-16 pt-6 sm:px-10 sm:pt-8">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
