import { SignJWT, jwtVerify } from "jose";
import { ADMIN_SESSION_AUDIENCE, ADMIN_SESSION_ISSUER } from "@/lib/auth-constants";

export function getAuthKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  const key = new TextEncoder().encode(secret);
  return key.length >= 32 ? key : null;
}

export async function verifyAdminToken(token) {
  const key = getAuthKey();
  if (!token) return null;
  if (!key) {
    console.error("Admin session verification failed: AUTH_SECRET is missing or too short in this runtime.");
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
      issuer: ADMIN_SESSION_ISSUER,
      audience: ADMIN_SESSION_AUDIENCE,
    });
    if (!payload.sub || payload.role !== "admin" || !Number.isSafeInteger(payload.sessionVersion)) {
      console.error("Admin session verification failed: token claims are invalid.");
      return null;
    }
    return { adminId: payload.sub, role: payload.role, sessionVersion: payload.sessionVersion };
  } catch (error) {
    console.error("Admin session verification failed:", error?.code || error?.name || "unknown token error");
    return null;
  }
}

export async function createAdminToken(admin) {
  const key = getAuthKey();
  if (!key) throw new Error("AUTH_SECRET must contain at least 32 characters.");
  return new SignJWT({ role: admin.role, sessionVersion: Number(admin.sessionVersion) || 0 })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(String(admin._id))
    .setIssuer(ADMIN_SESSION_ISSUER)
    .setAudience(ADMIN_SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(key);
}
