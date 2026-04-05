import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontHeading = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ClauseGuard | AI-Powered Legal Contract Analysis",
    template: "%s | ClauseGuard"
  },
  description: "Secure your business with ClauseGuard. Our AI-driven engine analyzes contracts for risks, benchmarks against industry standards, and provides instant legal insights.",
  keywords: ["legal technology", "AI contract analysis", "legal risk assessment", "smart contract review", "legaltech saas"],
  authors: [{ name: "Muhammad Umer" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://clauseguard.ai",
    siteName: "ClauseGuard",
    title: "ClauseGuard | AI-Powered Legal Contract Analysis",
    description: "Instant, intelligent legal analysis for the modern enterprise. Shield your agreements with AI.",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "ClauseGuard - Legal AI Protection"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClauseGuard | AI-Powered Legal Contract Analysis",
    description: "Instant, intelligent legal analysis for the modern enterprise. Shield your agreements with AI.",
    creator: "@muhammadumer",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontHeading.variable} font-sans h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full bg-background text-foreground selection:bg-primary/20 transition-colors duration-300"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
