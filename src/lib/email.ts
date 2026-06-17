import nodemailer from "nodemailer";
import { getSystemConfig } from "@/lib/system-config";

async function createTransporter() {
  const cfg = await getSystemConfig();
  return nodemailer.createTransport({
    host: cfg.smtpHost || "smtp.gmail.com",
    port: Number(cfg.smtpPort || 587),
    secure: false,
    auth: cfg.smtpUser ? { user: cfg.smtpUser, pass: cfg.smtpPassword || undefined } : undefined,
  });
}

export async function sendAdminVerificationEmail(
  toEmail: string,
  otp: string,
  adminEmail: string
) {
  const cfg = await getSystemConfig();
  const devMode = !cfg.smtpUser;

  if (devMode) {
    console.log(`\n[DEV MODE] Admin verification OTP for ${adminEmail} → sent to ${toEmail}: ${otp}\n`);
    return;
  }

  const transporter = await createTransporter();
  await transporter.sendMail({
    from: cfg.smtpFrom || "sailxchina <no-reply@sailxchina.com>",
    to: toEmail,
    subject: "SailX Admin Login Verification Code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0f0f0f;border-radius:12px;color:#fff">
        <h2 style="margin:0 0 8px">Admin Login Verification</h2>
        <p style="color:#aaa;margin:0 0 24px">A login attempt was made for <strong>${adminEmail}</strong>. Use this code to complete admin sign-in. Expires in 10 minutes.</p>
        <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:24px;text-align:center;font-size:36px;font-weight:700;letter-spacing:8px;color:#fff">
          ${otp}
        </div>
        <p style="color:#666;font-size:12px;margin:24px 0 0">If you did not attempt to sign in, ignore this email and secure your admin credentials.</p>
      </div>
    `,
  });
}

export async function sendOtpEmail(email: string, otp: string) {
  const cfg = await getSystemConfig();
  const devMode = !cfg.smtpUser;

  if (devMode) {
    console.log(`\n[DEV MODE] OTP for ${email}: ${otp}\n`);
    return;
  }

  const transporter = await createTransporter();
  await transporter.sendMail({
    from: cfg.smtpFrom || "sailxchina <no-reply@sailxchina.com>",
    to: email,
    subject: "Your sailxchina Login Code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0f0f0f;border-radius:12px;color:#fff">
        <h2 style="margin:0 0 8px">Your Login Code</h2>
        <p style="color:#aaa;margin:0 0 24px">Use this code to sign in to sailxchina. Expires in 10 minutes.</p>
        <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:24px;text-align:center;font-size:36px;font-weight:700;letter-spacing:8px;color:#fff">
          ${otp}
        </div>
        <p style="color:#666;font-size:12px;margin:24px 0 0">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendEventReceiptEmail(opts: {
  email: string; name: string; eventTitle: string; city: string;
  startDate: string; endDate: string; seats: number;
  totalAmount: number; bookingId: string; pdfBuffer: Buffer;
}) {
  const cfg = await getSystemConfig();
  const devMode = !cfg.smtpUser;
  if (devMode) {
    console.log(`[DEV MODE] Event receipt for booking ${opts.bookingId} → ${opts.email}`);
    return;
  }
  const transporter = await createTransporter();
  await transporter.sendMail({
    from: cfg.smtpFrom || "sailxchina <no-reply@sailxchina.com>",
    to: opts.email,
    subject: `Booking Confirmed – ${opts.eventTitle} | sailxchina`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#1a1a1a">
        <h2 style="color:#0066cc">✅ Booking Confirmed!</h2>
        <p>Hi <strong>${opts.name}</strong>, your seats are booked.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Event</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:600">${opts.eventTitle}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">City</td><td style="padding:8px;border-bottom:1px solid #eee">${opts.city}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Dates</td><td style="padding:8px;border-bottom:1px solid #eee">${opts.startDate} → ${opts.endDate}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Seats</td><td style="padding:8px;border-bottom:1px solid #eee">${opts.seats}</td></tr>
          <tr><td style="padding:8px;color:#666">Total Paid</td><td style="padding:8px;font-weight:700;color:#16a34a">₹${opts.totalAmount.toLocaleString("en-IN")}</td></tr>
        </table>
        <p style="color:#555">Your PDF ticket is attached. Please carry it on the day of the event.</p>
        <p style="color:#999;font-size:12px">Booking ID: ${opts.bookingId} · sailxchina Business Tours</p>
      </div>
    `,
    attachments: [{
      filename: `booking-${opts.bookingId}.pdf`,
      content: opts.pdfBuffer,
      contentType: "application/pdf",
    }],
  });
}

export async function sendInvoiceEmail(
  email: string,
  name: string,
  orderCode: string,
  pdfBuffer: Buffer
) {
  const cfg = await getSystemConfig();
  const devMode = !cfg.smtpUser;
  if (devMode) {
    console.log(`[DEV MODE] Would send invoice for order ${orderCode} to ${email}`);
    return;
  }

  const transporter = await createTransporter();
  await transporter.sendMail({
    from: cfg.smtpFrom || "sailxchina <no-reply@sailxchina.com>",
    to: email,
    subject: `Invoice for Order #${orderCode} — sailxchina`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;color:#333">
        <h2>Hi ${name},</h2>
        <p>Thank you for your order. Please find your invoice attached.</p>
        <p><strong>Order Code:</strong> ${orderCode}</p>
        <hr/>
        <p style="color:#999;font-size:12px">sailxchina B2B Sourcing Platform</p>
      </div>
    `,
    attachments: [
      {
        filename: `invoice-${orderCode}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}
