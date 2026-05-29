import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { AppProviders } from "./providers";
import { FloatingCommandPalette } from "@/components/ai/floating-command-palette";
import { FloatingCopilot } from "@/components/ai/floating-copilot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Estate AI — AI-Powered Real Estate Investing",
  description:
    "Analyze markets, discover opportunities, and make smarter investment decisions using autonomous AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const content = (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProviders>
          {children}
          <FloatingCommandPalette />
          <FloatingCopilot />
        </AppProviders>
      </body>
    </html>
  );

  if (clerkKey) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
