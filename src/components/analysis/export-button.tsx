"use client";
import { useState } from "react";
import { Download, Loader2, FileCheck } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface ExportButtonProps {
  document: any;
  analysis: any;
}

export function ExportButton({ document, analysis }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!analysis) return;
    setIsExporting(true);

    try {
      // Create a professional PDF report
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let cursorY = 30;

      // --- PAGE 1: COVER PAGE ---
      pdf.setFillColor(20, 20, 25); // Dark Slate BG matching our theme
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      // Cobalt Blue Accent Design Element
      pdf.setDrawColor(88, 140, 255);
      pdf.setLineWidth(1);
      pdf.line(margin, 50, pageWidth - margin, 50);

      // Logo/Brand Placeholder
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(32);
      pdf.setFont("helvetica", "bold");
      pdf.text("ClauseGuard", margin, 42);

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(180, 180, 190);
      pdf.text("AI-Powered Legal Intelligence Report", margin, 65);

      // Title Section
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      const titleLines = pdf.splitTextToSize(document.filename, pageWidth - margin * 2);
      pdf.text(titleLines, margin, 110);

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(160, 160, 170);
      pdf.text(`Analyzed on: ${new Date().toLocaleDateString()}`, margin, 140);

      // Simple Stats on cover
      const score = analysis.overall_risk_score.toFixed(0);
      const riskLevel = analysis.risk_level || (score < 50 ? "High" : score < 80 ? "Medium" : "Low");
      
      pdf.setDrawColor(255, 255, 255, 0.1);
      pdf.setFillColor(255, 255, 255, 0.05);
      pdf.roundedRect(margin, 160, 80, 40, 5, 5, "FD");
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text("OVERALL RISK SCORE", margin + 10, 172);
      pdf.setFontSize(24);
      pdf.text(`${score}/100`, margin + 10, 188);

      pdf.roundedRect(pageWidth - margin - 80, 160, 80, 40, 5, 5, "FD");
      pdf.setTextColor(riskLevel === "High" ? 255 : 255, riskLevel === "High" ? 100 : 255, riskLevel === "High" ? 100 : 255);
      pdf.setFontSize(10);
      pdf.text("RISK CLASSIFICATION", pageWidth - margin - 70, 172);
      pdf.setFontSize(24);
      pdf.text(riskLevel.toUpperCase(), pageWidth - margin - 70, 188);

      // --- PAGE 2: EXECUTIVE SUMMARY ---
      pdf.addPage();
      pdf.setTextColor(20, 20, 25);
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("Executive Summary", margin, 30);
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 70);
      const summaryLines = pdf.splitTextToSize(analysis.summary, pageWidth - margin * 2);
      pdf.text(summaryLines, margin, 42);

      cursorY = 42 + (summaryLines.length * 5) + 20;

      // --- PAGE 2: KEY RISKS ---
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(20, 20, 25);
      pdf.text("Critical Risk Assessment", margin, cursorY);
      cursorY += 12;

      analysis.risks?.slice(0, 5).forEach((risk: any) => {
        if (cursorY > pageHeight - 40) {
          pdf.addPage();
          cursorY = 30;
        }

        // Risk Container
        pdf.setDrawColor(230, 230, 235);
        pdf.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 8;

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(risk.title, margin, cursorY);
        
        pdf.setFontSize(9);
        const sevColor = risk.severity === "high" ? [220, 38, 38] : [234, 179, 8];
        pdf.setTextColor(sevColor[0], sevColor[1], sevColor[2]);
        pdf.text(`${risk.severity.toUpperCase()} SEVERITY`, pageWidth - margin - 35, cursorY);
        
        pdf.setTextColor(80, 80, 90);
        pdf.setFont("helvetica", "normal");
        cursorY += 6;
        const riskLines = pdf.splitTextToSize(risk.description, pageWidth - margin * 2);
        pdf.text(riskLines, margin, cursorY);
        cursorY += (riskLines.length * 4) + 6;

        pdf.setFillColor(245, 245, 250);
        pdf.roundedRect(margin, cursorY, pageWidth - margin * 2, 12, 2, 2, "F");
        pdf.setTextColor(40, 40, 50);
        pdf.setFont("helvetica", "italic");
        pdf.text(`Rec: ${risk.recommendation.substring(0, 100)}...`, margin + 4, cursorY + 7);
        cursorY += 20;
      });

      pdf.save(`ClauseGuard_Report_${document.filename.replace(/\.[^/.]+$/, "")}.pdf`);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || !analysis}
      className={`relative inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all transform active:scale-95 shadow-xl ${
        isExporting 
          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
          : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30 hover:-translate-y-1"
      }`}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Preparing Report...
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          Export Intelligence Report
        </>
      )}
    </button>
  );
}
