import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontHeading = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClauseGuard by Muhammad Umer",
  description: "AI Legal Contract Analyzer",
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
        className="min-h-full flex bg-background text-foreground selection:bg-primary/20 overflow-hidden"
        suppressHydrationWarning
      >
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth z-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
