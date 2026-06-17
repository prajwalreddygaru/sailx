import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
    : undefined
});

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM || "sailxchina <no-reply@sailxchina.com>",
    ...opts
  });
}

export const emailTemplates = {
  welcome: (name: string) => ({
    subject: "Welcome to sailxchina",
    html: `<div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
      <h1 style="font-size: 22px; margin: 0 0 8px;">Welcome to sailxchina, ${name}!</h1>
      <p style="color: #475569; line-height: 1.6;">Your account is ready. Start by submitting your first RFQ — we'll match you with a verified sourcing agent within 24 hours.</p>
      <a href="https://sailxchina.com/dashboard/buyer/rfqs/new" style="display:inline-block; background:#2563eb; color:white; padding:10px 16px; border-radius:8px; text-decoration:none; margin-top:16px;">Create your first RFQ</a>
    </div>`
  }),
  quotationReceived: (rfqCode: string, supplier: string) => ({
    subject: `New quotation received for ${rfqCode}`,
    html: `<div style="font-family: -apple-system, sans-serif;"><h2>New quotation</h2><p>${supplier} has submitted a quotation for ${rfqCode}.</p></div>`
  }),
  shipmentUpdate: (orderCode: string, status: string) => ({
    subject: `Shipment update: ${orderCode}`,
    html: `<div style="font-family: -apple-system, sans-serif;"><h2>Shipment update</h2><p>Your order ${orderCode} is now <strong>${status}</strong>.</p></div>`
  })
};
