import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Terminal Style UI",
  description: "Pure dark background with bright mono text, terminal-like UI.",
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
            <a href="/" className="text-sm font-mono terminal-accent">{"$> Kaya"}</a>
            <nav className="flex items-center gap-4 text-sm"></nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl px-6 pb-16 pt-6 sm:px-10 sm:pt-8">{children}</main>
      </body>
    </html>
  );
}
