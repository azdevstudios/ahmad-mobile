import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/database/db";
import Admin from "@/models/Admin";
import { getAdmin, setAdminSession, unauthorizedAdminResponse } from "@/lib/auth";

export async function POST(request) {
  const session = await getAdmin();
  if (!session) return unauthorizedAdminResponse();
  const body = await request.json().catch(() => null);
  if (
    !body || typeof body.currentPassword !== "string" || body.currentPassword.length > 128 ||
    typeof body.newPassword !== "string" || body.newPassword.length < 12 || body.newPassword.length > 128
  ) {
    return NextResponse.json({ success: false, message: "Enter your current password and a new password of at least 12 characters." }, { status: 400 });
  }

  try {
    await connectDB();
    const admin = await Admin.findById(session.adminId).select("+password sessionVersion");
    if (!admin) return unauthorizedAdminResponse();
    if (!(await bcrypt.compare(body.currentPassword, admin.password))) {
      return NextResponse.json({ success: false, message: "Your current password is incorrect." }, { status: 400 });
    }
    admin.password = await bcrypt.hash(body.newPassword, 12);
    admin.sessionVersion = Number(admin.sessionVersion || 0) + 1;
    await admin.save();
    return await setAdminSession(NextResponse.json({ success: true, message: "Password updated." }), admin);
  } catch (error) {
    console.error("Admin password change failed:", error.message);
    return NextResponse.json({ success: false, message: "Could not change the password right now." }, { status: 503 });
  }
}
