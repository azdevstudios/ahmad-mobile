import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/database/db";
import Admin from "@/models/Admin";
import { getAuthKey } from "@/lib/auth-token";
import { setAdminSession } from "@/lib/auth";

function matchesSetupKey(candidate, expected) {
  const provided = Buffer.from(candidate, "utf8");
  const configured = Buffer.from(expected, "utf8");
  return provided.length === configured.length && timingSafeEqual(provided, configured);
}

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json(
      { setupAvailable: !(await Admin.exists({})) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ setupAvailable: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

export async function POST(request) {
  const setupKey = process.env.ADMIN_SETUP_KEY;
  if (!setupKey || new TextEncoder().encode(setupKey).length < 32) {
    return NextResponse.json({ success: false, message: "One-time admin setup is not configured on the server." }, { status: 503 });
  }
  if (!getAuthKey()) {
    return NextResponse.json({ success: false, message: "Admin sign-in is not configured correctly." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (
    !body || typeof body.name !== "string" || typeof body.email !== "string" ||
    typeof body.password !== "string" || typeof body.setupKey !== "string" ||
    body.name.trim().length < 2 || body.name.trim().length > 80 ||
    body.email.length > 254 || body.password.length < 12 || body.password.length > 128 ||
    body.setupKey.length > 256
  ) {
    return NextResponse.json({ success: false, message: "Check the account details and password length." }, { status: 400 });
  }
  if (!matchesSetupKey(body.setupKey, setupKey)) {
    return NextResponse.json({ success: false, message: "The one-time setup key is incorrect." }, { status: 401 });
  }

  const email = body.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, message: "Enter a valid email address." }, { status: 400 });
  }

  try {
    await connectDB();
    await Admin.init();
    if (await Admin.exists({})) {
      return NextResponse.json({ success: false, message: "Admin setup has already been completed." }, { status: 409 });
    }

    const admin = await Admin.create({
      name: body.name.trim(),
      email,
      password: await bcrypt.hash(body.password, 12),
      role: "admin",
      sessionVersion: 0,
      setupSlot: "primary",
    });
    const response = NextResponse.json({
      success: true,
      admin: { id: String(admin._id), name: admin.name, email: admin.email },
    }, { status: 201 });
    return await setAdminSession(response, admin);
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: "Admin setup has already been completed." }, { status: 409 });
    }
    console.error("Initial admin setup failed:", error.message);
    return NextResponse.json({ success: false, message: "Could not create the admin account." }, { status: 503 });
  }
}
