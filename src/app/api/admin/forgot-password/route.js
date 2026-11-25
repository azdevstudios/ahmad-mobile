import { createHash, randomBytes } from "node:crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import Admin from "@/models/Admin";
import AdminPasswordReset from "@/models/AdminPasswordReset";

function recoveryIsConfigured() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.APP_URL) return false;
  try {
    const url = new URL(process.env.APP_URL);
    return process.env.NODE_ENV !== "production" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request) {
  if (!recoveryIsConfigured()) {
    return NextResponse.json({ success: false, message: "Email password recovery is not configured yet." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.email !== "string" || body.email.length > 254) {
    return NextResponse.json({ success: false, message: "Enter a valid admin email." }, { status: 400 });
  }

  const generic = NextResponse.json({
    success: true,
    message: "If that email belongs to an admin, a reset link will be sent shortly.",
  }, { headers: { "Cache-Control": "no-store" } });

  try {
    await connectDB();
    const admin = await Admin.findOne({ email: body.email.trim().toLowerCase(), role: "admin" }).select("_id email");
    if (!admin) return generic;

    const recentRequest = await AdminPasswordReset.findOne({ adminId: admin._id, createdAt: { $gt: new Date(Date.now() - 2 * 60 * 1000) } });
    if (recentRequest) return generic;

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");
    await AdminPasswordReset.deleteMany({ adminId: admin._id });
    await AdminPasswordReset.create({
      adminId: admin._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 20 * 60 * 1000),
    });

    const port = Number(process.env.SMTP_PORT || 465);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const resetUrl = new URL("/admin/reset-password", process.env.APP_URL);
    resetUrl.searchParams.set("token", rawToken);

    try {
      await transport.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: admin.email,
        subject: "Reset your Ahmed Mobile admin password",
        text: "Use this one-time link within 20 minutes to reset your password: " + resetUrl.toString(),
        html: "<p>Use this one-time link within 20 minutes to reset your password.</p><p><a href=\"" + resetUrl.toString() + "\">Reset admin password</a></p><p>If you did not request this, ignore this email.</p>",
      });
    } catch (mailError) {
      await AdminPasswordReset.deleteOne({ tokenHash });
      console.error("Password reset email delivery failed:", mailError.message);
    }
    return generic;
  } catch (error) {
    console.error("Password recovery request failed:", error.message);
    return NextResponse.json({ success: false, message: "Could not process the request right now." }, { status: 503 });
  }
}

