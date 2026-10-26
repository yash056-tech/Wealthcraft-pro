import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ReportMetric {
  label: string;
  value: string;
  sublabel?: string;
}

export interface ReportSection {
  title: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface GeneratePdfOptions {
  title: string;
  category: string;
  clientName?: string;
  summaryMetrics: ReportMetric[];
  sections: ReportSection[];
  advisorNotes?: string[];
}

export function generateFinancialPdfReport(options: GeneratePdfOptions): void {
  const {
    title,
    category,
    clientName = "Private Wealth Client",
    summaryMetrics,
    sections,
    advisorNotes,
  } = options;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  // 1. Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 85, "F");

  // Gold accent line
  doc.setFillColor(217, 119, 6); // Amber 600
  doc.rect(0, 85, pageWidth, 4, "F");

  // Logo / App Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("WEALTHCRAFT PRO", margin, 38);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text("PREMIUM FINANCIAL ADVISORY & SIMULATION SUITE", margin, 52);

  // Date and Report ID on top right
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const reportId = `WP-${Math.floor(100000 + Math.random() * 900000)}`;

  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`CONFIDENTIAL ADVISORY MEMO`, pageWidth - margin, 35, { align: "right" });
  doc.text(`Date: ${dateStr}  |  Ref: ${reportId}`, pageWidth - margin, 48, { align: "right" });
  doc.text(`Client: ${clientName}`, pageWidth - margin, 60, { align: "right" });

  let currentY = 115;

  // 2. Scenario Title & Category Badge
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(title, margin, currentY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Domain: ${category}  •  Currency: Indian Rupee (INR ₹)`, margin, currentY + 16);

  currentY += 36;

  // 3. Key Summary Metrics Cards
  if (summaryMetrics && summaryMetrics.length > 0) {
    const cardGap = 12;
    const cardsPerRow = Math.min(3, summaryMetrics.length);
    const cardWidth = (pageWidth - margin * 2 - (cardsPerRow - 1) * cardGap) / cardsPerRow;
    const cardHeight = 52;

    summaryMetrics.slice(0, 6).forEach((metric, index) => {
      const row = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;
      const x = margin + col * (cardWidth + cardGap);
      const y = currentY + row * (cardHeight + 10);

      // Card background
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(x, y, cardWidth, cardHeight, 4, 4, "F");
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(x, y, cardWidth, cardHeight, 4, 4, "S");

      // Metric Label
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(metric.label.toUpperCase(), x + 10, y + 16);

      // Metric Value
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(metric.value, x + 10, y + 33);

      if (metric.sublabel) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(metric.sublabel, x + 10, y + 44);
      }
    });

    const numRows = Math.ceil(Math.min(summaryMetrics.length, 6) / cardsPerRow);
    currentY += numRows * (cardHeight + 10) + 15;
  }

  // 4. Data Tables
  sections.forEach((section) => {
    if (currentY > pageHeight - 120) {
      doc.addPage();
      currentY = 50;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(section.title, margin, currentY);
    currentY += 8;

    autoTable(doc, {
      startY: currentY,
      head: [section.headers],
      body: section.rows,
      theme: "grid",
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [51, 65, 85],
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      tableLineColor: [226, 232, 240],
      tableLineWidth: 0.5,
      didDrawPage: () => {
        // Footer on every page
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(
          "WealthCraft Pro Advisory Memo — Generated for planning purposes only. Complies with SEBI / Indian Tax FY25 frameworks.",
          pageWidth / 2,
          pageHeight - 20,
          { align: "center" }
        );
      },
    });

    // @ts-expect-error autoTable adds lastAutoTable to doc
    currentY = doc.lastAutoTable.finalY + 24;
  });

  // 5. Advisor Notes / Legal Disclaimer
  if (currentY > pageHeight - 100) {
    doc.addPage();
    currentY = 50;
  }

  if (advisorNotes && advisorNotes.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text("Strategic Advisory Notes:", margin, currentY);
    currentY += 12;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);

    advisorNotes.forEach((note) => {
      const splitLines = doc.splitTextToSize(`• ${note}`, pageWidth - margin * 2);
      doc.text(splitLines, margin, currentY);
      currentY += splitLines.length * 10;
    });
  }

  // Trigger download
  const safeFilename = `${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_report.pdf`;
  doc.save(safeFilename);
}
