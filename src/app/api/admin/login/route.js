import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/database/db";
import Admin from "@/models/Admin";
import AdminLoginAttempt from "@/models/AdminLoginAttempt";
import { getAuthKey } from "@/lib/auth-token";
import { setAdminSession } from "@/lib/auth";

const attemptsLimit = 6;
const attemptWindowMs = 15 * 60 * 1000;
const lockDurationMs = 15 * 60 * 1000;

function tooManyAttemptsResponse(lockedUntil) {
  const seconds = Math.max(1, Math.ceil((lockedUntil.getTime() - Date.now()) / 1000));
  return NextResponse.json(
    { success: false, message: "Too many sign-in attempts. Try again in 15 minutes." },
    { status: 429, headers: { "Retry-After": String(seconds), "Cache-Control": "no-store" } }
  );
}

export async function POST(request) {
  if (!getAuthKey()) {
    return NextResponse.json({ success: false, message: "Admin sign-in is not configured correctly." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (
    !body || typeof body.email !== "string" || typeof body.password !== "string" ||
    body.email.length > 254 || body.password.length > 128
  ) {
    return NextResponse.json({ success: false, message: "Enter a valid email and password." }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  const ip = (request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  const key = createHash("sha256").update(ip + "|" + email).digest("hex");
  const now = new Date();

  try {
    await connectDB();
    const record = await AdminLoginAttempt.findOne({ key });
    if (record?.lockedUntil && record.lockedUntil > now) {
      return tooManyAttemptsResponse(record.lockedUntil);
    }
    if (!record || now.getTime() - record.windowStartedAt.getTime() >= attemptWindowMs) {
      await AdminLoginAttempt.findOneAndUpdate(
        { key },
        {
          $set: { attempts: 0, windowStartedAt: now, lockedUntil: null, expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000) },
          $setOnInsert: { key },
        },
        { upsert: true, new: true }
      );
    }

    const admin = await Admin.findOne({ email, role: "admin" }).select("+password sessionVersion");
    const passwordValid = admin ? await bcrypt.compare(body.password, admin.password) : false;

    if (!admin || !passwordValid) {
      const failed = await AdminLoginAttempt.findOneAndUpdate(
        { key },
        { $inc: { attempts: 1 }, $set: { expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      if (failed.attempts >= attemptsLimit) {
        const lockedUntil = new Date(Date.now() + lockDurationMs);
        await AdminLoginAttempt.updateOne({ key }, { $set: { lockedUntil } });
        return tooManyAttemptsResponse(lockedUntil);
      }
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    await AdminLoginAttempt.deleteOne({ key });
    return await setAdminSession(NextResponse.json({
      success: true,
      admin: { id: String(admin._id), name: admin.name, email: admin.email },
    }), admin);
  } catch (error) {
    console.error("Admin sign-in failed:", error.message);
    return NextResponse.json({ success: false, message: "Could not sign in right now." }, { status: 503 });
  }
}
