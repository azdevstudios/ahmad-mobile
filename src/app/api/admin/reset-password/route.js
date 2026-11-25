import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/database/db";
import Admin from "@/models/Admin";
import AdminPasswordReset from "@/models/AdminPasswordReset";
import { clearAdminSession } from "@/lib/auth";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (
    !body || typeof body.token !== "string" || !/^[a-f0-9]{64}$/i.test(body.token) ||
    typeof body.password !== "string" || body.password.length < 12 || body.password.length > 128
  ) {
    return NextResponse.json({ success: false, message: "Use a valid reset link and a password of at least 12 characters." }, { status: 400 });
  }

  try {
    await connectDB();
    const tokenHash = createHash("sha256").update(body.token).digest("hex");
    const reset = await AdminPasswordReset.findOne({ tokenHash, expiresAt: { $gt: new Date() } });
    if (!reset) {
      return NextResponse.json({ success: false, message: "This reset link is invalid or has expired." }, { status: 400 });
    }
    const claimed = await AdminPasswordReset.deleteOne({ _id: reset._id, expiresAt: { $gt: new Date() } });
    if (claimed.deletedCount !== 1) {
      return NextResponse.json({ success: false, message: "This reset link has already been used." }, { status: 400 });
    }

    const admin = await Admin.findById(reset.adminId).select("+password sessionVersion");
    if (!admin) {
      return NextResponse.json({ success: false, message: "This admin account no longer exists." }, { status: 400 });
    }
    admin.password = await bcrypt.hash(body.password, 12);
    admin.sessionVersion = Number(admin.sessionVersion || 0) + 1;
    await admin.save();
    await AdminPasswordReset.deleteMany({ adminId: admin._id });

    return clearAdminSession(NextResponse.json({ success: true, message: "Password reset. Sign in with your new password." }, { headers: { "Cache-Control": "no-store" } }));
  } catch (error) {
    console.error("Admin password reset failed:", error.message);
    return NextResponse.json({ success: false, message: "Could not reset the password right now." }, { status: 503 });
  }
}

