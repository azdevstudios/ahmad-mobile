import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getAdmin, unauthorizedAdminResponse } from "@/lib/auth";

export const runtime = "nodejs";

const uploadFolder = "ahmad-mobiles/used-phones";

export async function POST(request) {
  if (!(await getAdmin())) return unauthorizedAdminResponse();

  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Check the server environment variables." },
      { status: 503 }
    );
  }

  let paramsToSign;
  try {
    paramsToSign = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid signature request." }, { status: 400 });
  }

  if (
    !paramsToSign ||
    typeof paramsToSign !== "object" ||
    String(paramsToSign.folder ?? "") !== uploadFolder ||
    paramsToSign.source !== "uw" ||
    !/^\d+$/.test(String(paramsToSign.timestamp ?? ""))
  ) {
    return NextResponse.json({ error: "Invalid upload parameters." }, { status: 400 });
  }

  try {
    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);
    return NextResponse.json({ signature });
  } catch {
    return NextResponse.json({ error: "Could not sign this upload." }, { status: 400 });
  }
}


