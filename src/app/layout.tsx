import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fontHeading = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://clauseguard.ai'),
  title: {
    default: "ClauseGuard | AI-Powered Legal Contract Analysis",
    template: "%s | ClauseGuard"
  },
  description: "Secure your business with ClauseGuard. Our AI-driven engine analyzes contracts for risks, benchmarks against industry standards, and provides instant legal insights in under 3 seconds.",
  keywords: [
    "legal contract analysis",
    "AI contract review",
    "contract risk scoring",
    "legal technology",
    "contract management",
    "legal AI",
    "contract due diligence",
    "contract risk assessment",
    "legal document analysis",
    "automated contract review"
  ],
  authors: [{ name: "Muhammad Umer" }],
  creator: "Muhammad Umer",
  publisher: "ClauseGuard",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://clauseguard.ai",
    siteName: "ClauseGuard",
    title: "ClauseGuard | AI-Powered Legal Contract Analysis",
    description: "Instant, intelligent legal analysis for the modern enterprise. Shield your agreements with AI-powered risk detection and benchmarking.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ClauseGuard - AI-Powered Legal Contract Analysis",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClauseGuard | AI-Powered Legal Contract Analysis",
    description: "Instant, intelligent legal analysis for the modern enterprise. Shield your agreements with AI.",
    creator: "@muhammadumer",
    images: ["/og-image.png"],
    site: "@clauseguard",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: {
      rel: "canonical",
      url: "https://clauseguard.ai",
    },
  },
  alternates: {
    canonical: "https://clauseguard.ai",
  },
  category: "Legal Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontHeading.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ClauseGuard",
              "description": "AI-powered legal contract analysis platform that provides risk scoring, clause analysis, and contract benchmarking.",
              "url": "https://clauseguard.ai",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free tier available"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "500"
              },
              "author": {
                "@type": "Person",
                "name": "Muhammad Umer"
              }
            }),
          }}
        />
      </head>
      <body 
        className="min-h-full bg-background text-foreground antialiased"
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}