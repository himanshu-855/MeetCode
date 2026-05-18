import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs";
import { Code2 } from "lucide-react";
import { AuthControls } from "@/components/AuthControls";
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
  title: "MeetCode",
  description: "Coding interview practice platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#131315] text-[#e5e1e4] antialiased`}
        >
          <header className="sticky top-0 z-50 h-14 border-b border-[#3c4a42] bg-[#131315]/95 backdrop-blur">
            <div className="mx-auto flex h-full max-w-screen-xl items-center justify-between gap-4 px-4">
              <Link href="/" className="flex items-center gap-2 font-bold">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#4edea3]">
                  <Code2 className="h-4 w-4 text-[#003824]" />
                </span>
                <span>
                  Meet<span className="text-[#4edea3]">Code</span>
                </span>
              </Link>

              <nav className="flex items-center gap-1 text-sm">
                <Link
                  href="/problems"
                  className="rounded-md px-3 py-2 text-[#bbcabf] hover:bg-[#201f22] hover:text-[#e5e1e4]"
                >
                  Problems
                </Link>
                <Link
                  href="/companies"
                  className="hidden rounded-md px-3 py-2 text-[#bbcabf] hover:bg-[#201f22] hover:text-[#e5e1e4] sm:inline-flex"
                >
                  Companies
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-md px-3 py-2 text-[#bbcabf] hover:bg-[#201f22] hover:text-[#e5e1e4]"
                >
                  Dashboard
                </Link>
              </nav>

              <div className="flex items-center gap-2">
                <AuthControls />
              </div>
            </div>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
