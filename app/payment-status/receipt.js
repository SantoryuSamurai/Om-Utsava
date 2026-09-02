const MAROON = [142, 36, 55];
const GOLD = [213, 171, 81];
const INK = [37, 59, 55];
const MUTED = [116, 108, 99];
const IVORY = [255, 250, 241];
const WARM = [244, 234, 219];
const LINE = [221, 207, 186];

function formatAmount(amount) {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

function formatPaidOn(value) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(value)).replace(",", "");
}

function drawRupee(pdf, x, baseline, size) {
  const top = baseline - size * 0.72;
  const middle = baseline - size * 0.47;
  const thickness = Math.max(1.1, size * 0.075);
  pdf.setDrawColor(...INK);
  pdf.setLineWidth(thickness);
  pdf.line(x, top, x + size * 0.66, top);
  pdf.line(x, middle, x + size * 0.66, middle);
  pdf.line(x + size * 0.08, top, x + size * 0.56, middle);
  pdf.line(x + size * 0.44, middle, x + size * 0.11, baseline);
}

async function logoData() {
  const response = await fetch("/om-utsava-mark.png");
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function downloadReceipt(receipt) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ format: "a5", unit: "pt" });
  const pageWidth = 419.53;
  const pageHeight = 595.28;
  const right = 385;

  pdf.setFillColor(...IVORY);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");
  pdf.setFillColor(...MAROON);
  pdf.rect(0, 0, pageWidth, 82, "F");

  try {
    pdf.addImage(await logoData(), "PNG", 35, 23, 36, 36);
  } catch {
    // A receipt remains valid if the decorative logo cannot be loaded.
  }
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("times", "bold");
  pdf.setFontSize(19);
  pdf.text("OM UTSAVA", 79, 43);
  pdf.setTextColor(241, 220, 166);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.text("GANESH CHATURTHI 2026 - SHANTINAGAR, BANGARPET", 80, 57);

  const headingY = 112;
  pdf.setTextColor(...MAROON);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.text("CONTRIBUTION RECEIPT", 35, headingY);
  pdf.setTextColor(...INK);
  pdf.setFont("times", "bold");
  pdf.setFontSize(29);
  drawRupee(pdf, 35, headingY + 38, 26);
  pdf.text(formatAmount(receipt.amount), 57, headingY + 38);

  pdf.setFillColor(232, 241, 231);
  pdf.roundedRect(240, headingY + 18, 145, 25, 12.5, 12.5, "F");
  pdf.setDrawColor(57, 115, 74);
  pdf.setLineWidth(1.4);
  pdf.line(260, headingY + 28, 263, headingY + 31);
  pdf.line(263, headingY + 31, 269, headingY + 24);
  pdf.setTextColor(57, 115, 74);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.text("PAYMENT SUCCESSFUL", 281, headingY + 34);

  const dividerY = headingY + 65;
  pdf.setDrawColor(...LINE);
  pdf.setLineDashPattern([3, 3], 0);
  pdf.line(35, dividerY, right, dividerY);
  pdf.setLineDashPattern([], 0);

  const rows = [
    ["Order ID", receipt.orderId],
    ["Transaction ID", receipt.transactionId],
    ["Payment mode", receipt.paymentMode],
    ["Paid on", formatPaidOn(receipt.paidOn)],
    ["Contributor", receipt.contributor],
  ];
  rows.forEach(([label, value], index) => {
    const rowY = dividerY + 28 + index * 23;
    pdf.setTextColor(...MUTED);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.text(label, 35, rowY);
    pdf.setTextColor(...INK);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(label === "Order ID" ? 7.6 : 8.5);
    pdf.text(String(value), 165, rowY, { maxWidth: 210 });
  });

  const purposeDividerY = dividerY + 139;
  pdf.setDrawColor(...LINE);
  pdf.setLineDashPattern([3, 3], 0);
  pdf.line(35, purposeDividerY, right, purposeDividerY);
  pdf.setLineDashPattern([], 0);
  pdf.setTextColor(...MUTED);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.text("Contribution purpose", 35, purposeDividerY + 22);
  pdf.setTextColor(...INK);
  pdf.setFont("helvetica", "bold");
  pdf.text("Om Utsava 2026 - Ganesh Chaturthi celebration", 35, purposeDividerY + 38);

  const panelY = 389;
  pdf.setFillColor(...WARM);
  pdf.roundedRect(35, panelY, 350, 86, 6, 6, "F");
  const ornamentY = panelY + 65;
  pdf.setDrawColor(...GOLD);
  pdf.setLineWidth(0.7);
  pdf.line(122, ornamentY, 188, ornamentY);
  pdf.line(232, ornamentY, 298, ornamentY);
  pdf.setFillColor(...GOLD);
  pdf.circle(pageWidth / 2, ornamentY, 2.4, "F");
  pdf.circle(pageWidth / 2 - 8, ornamentY, 1.1, "F");
  pdf.circle(pageWidth / 2 + 8, ornamentY, 1.1, "F");
  pdf.setTextColor(...MAROON);
  pdf.setFont("times", "italic");
  pdf.setFontSize(17);
  pdf.text("Ganapati Bappa Morya", pageWidth / 2, panelY + 40, { align: "center" });
  pdf.setTextColor(...MUTED);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.text("Thank you for supporting our community celebration.", pageWidth / 2, panelY + 60, { align: "center" });

  pdf.setTextColor(...MUTED);
  pdf.setFontSize(6.8);
  pdf.text("This acknowledges a voluntary festival contribution. It is not a tax-exemption certificate.", pageWidth / 2, 552, { align: "center" });
  pdf.text("Om Utsava Organising Committee - Shantinagar, Bangarpet", pageWidth / 2, 564, { align: "center" });
  pdf.save(`om-utsava-receipt-${receipt.orderId}.pdf`);
}
