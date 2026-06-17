import PDFDocument from "pdfkit";

interface OrderData {
  code: string;
  productTitle: string;
  quantity: number;
  quotedPrice: number;
  isBulk: boolean;
  createdAt: Date;
  user: { name: string; email: string };
}

export function generateInvoice(order: OrderData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const total = (order.quotedPrice * order.quantity).toFixed(2);

    // Header
    doc.fontSize(22).font("Helvetica-Bold").text("SAILX", 50, 50);
    doc.fontSize(10).font("Helvetica").fillColor("#666").text("B2B Sourcing Platform", 50, 78);

    doc.moveTo(50, 100).lineTo(545, 100).strokeColor("#e5e7eb").stroke();

    // Invoice title
    doc.fillColor("#111").fontSize(18).font("Helvetica-Bold").text("INVOICE", 50, 115);
    doc.fontSize(10).font("Helvetica").fillColor("#666");
    doc.text(`Invoice #: ${order.code}`, 50, 140);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, 50, 155);
    doc.text(`Type: ${order.isBulk ? "Bulk Order" : "Sample Order"}`, 50, 170);

    // Bill To
    doc.fillColor("#111").fontSize(11).font("Helvetica-Bold").text("Bill To:", 350, 140);
    doc.font("Helvetica").fontSize(10).fillColor("#444");
    doc.text(order.user.name, 350, 158);
    doc.text(order.user.email, 350, 173);

    doc.moveTo(50, 200).lineTo(545, 200).strokeColor("#e5e7eb").stroke();

    // Table header
    doc.fillColor("#f9fafb").rect(50, 210, 495, 25).fill();
    doc.fillColor("#111").fontSize(10).font("Helvetica-Bold");
    doc.text("Product", 60, 218);
    doc.text("Qty", 360, 218);
    doc.text("Unit Price", 410, 218);
    doc.text("Total", 490, 218);

    // Table row
    doc.font("Helvetica").fillColor("#333").fontSize(10);
    doc.text(order.productTitle, 60, 248, { width: 290 });
    doc.text(String(order.quantity), 360, 248);
    doc.text(`₹${order.quotedPrice.toFixed(2)}`, 410, 248);
    doc.text(`₹${total}`, 490, 248);

    doc.moveTo(50, 270).lineTo(545, 270).strokeColor("#e5e7eb").stroke();

    // Total
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#111");
    doc.text("Total Amount:", 390, 285);
    doc.text(`₹${total}`, 490, 285);

    doc.fontSize(9).font("Helvetica").fillColor("#999");
    doc.text("Thank you for your business. For queries: info@sailxchina.com", 50, 360);

    doc.end();
  });
}
