import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import Admin from "@/models/Admin";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE } from "@/lib/auth-constants";
import { createAdminToken, verifyAdminToken } from "@/lib/auth-token";

export async function getAdmin() {
  try {
    const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
    const session = await verifyAdminToken(token);
    if (!session) return null;
    await connectDB();
    const admin = await Admin.findById(session.adminId).select("role sessionVersion");
    if (!admin || admin.role !== "admin" || Number(admin.sessionVersion || 0) !== session.sessionVersion) return null;
    return { adminId: String(admin._id), role: admin.role, sessionVersion: session.sessionVersion };
  } catch {
    return null;
  }
}

export async function setAdminSession(response, admin) {
  const token = await createAdminToken(admin);
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export function clearAdminSession(response) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export function unauthorizedAdminResponse() {
  return NextResponse.json(
    { success: false, message: "Please sign in to continue." },
    { status: 401, headers: { "Cache-Control": "no-store" } }
  );
}
