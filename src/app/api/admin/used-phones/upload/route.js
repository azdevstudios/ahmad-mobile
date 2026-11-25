import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getAdmin, unauthorizedAdminResponse } from "@/lib/auth";

export const runtime = "nodejs";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageSize = 8 * 1024 * 1024;

export async function GET() {
  if (!(await getAdmin())) return unauthorizedAdminResponse();

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;

  if (!cloudName || !apiKey) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Check the server environment variables." },
      { status: 503 }
    );
  }

  return NextResponse.json({ cloudName, apiKey });
}

export async function POST(request) {

  if (!(await getAdmin())) return unauthorizedAdminResponse();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Check the server environment variables." },
      { status: 503 }
    );
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Could not read the uploaded photo." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file.arrayBuffer !== "function") {
    return NextResponse.json({ error: "Choose a photo to upload." }, { status: 400 });
  }

  if (!allowedImageTypes.has(file.type)) {
    return NextResponse.json(
      { error: "Use a JPG, PNG or WebP photo." },
      { status: 415 }
    );
  }

  if (file.size === 0 || file.size > maxImageSize) {
    return NextResponse.json(
      { error: "Each photo must be smaller than 8 MB." },
      { status: 413 }
    );
  }

  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "ahmad-mobiles/used-phones",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    });

    return NextResponse.json({
      image: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error("Used phone image upload failed:", error.message);
    return NextResponse.json(
      { error: "Photo upload failed. Check the Cloudinary settings and try again." },
      { status: 502 }
    );
  }
}




