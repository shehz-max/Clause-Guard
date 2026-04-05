import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex bg-background text-foreground selection:bg-primary/20 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth z-0">
          {children}
        </main>
      </div>
    </div>
  );
}
