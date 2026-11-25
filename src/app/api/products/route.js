import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import Product from "@/models/Product";
import { ensureCatalogSeeded } from "@/lib/catalog/seed";
import { getAdmin, unauthorizedAdminResponse } from "@/lib/auth";

const validTypes = new Set(["used", "installment"]);
const validStatuses = new Set(["Available", "Reserved", "Sold", "Draft"]);

function serializeProduct(product) {
  const item = typeof product.toObject === "function" ? product.toObject() : product;
  return { ...item, id: String(item._id), _id: undefined, __v: undefined };
}

function validateProduct(body) {
  if (!body || !validTypes.has(body.type)) return "Select a valid phone category.";
  if (!body.name?.trim() || !body.brand?.trim()) return "Phone name and brand are required.";
  if (!Number.isFinite(Number(body.price)) || Number(body.price) < 1) return "Enter a valid phone price.";
  if (body.status && !validStatuses.has(body.status)) return "Select a valid phone status.";
  if (body.images !== undefined && (!Array.isArray(body.images) || body.images.length > 5)) return "Add no more than five photos.";
  if (Array.isArray(body.images) && body.images.some((image) => !image?.url || !(image.url.startsWith("/") || /^https:\/\//i.test(image.url)))) {
    return "Phone photos must use a local path or HTTPS URL.";
  }
  return null;
}

function pickProductFields(body) {
  const type = body.type;
  const images = Array.isArray(body.images) ? body.images.map((image) => ({
    url: image.url,
    publicId: image.publicId ?? "",
    width: Number(image.width) || null,
    height: Number(image.height) || null,
  })) : [];

  return {
    type,
    name: body.name.trim(),
    brand: body.brand.trim(),
    code: String(body.code ?? "").trim(),
    storage: type === "used" ? String(body.storage ?? "").trim() : (Array.isArray(body.storage) ? body.storage : []),
    condition: String(body.condition ?? "").trim(),
    pta: String(body.pta ?? "").trim(),
    price: Number(body.price),
    colors: Array.isArray(body.colors) ? body.colors : [],
    downPayments: Array.isArray(body.downPayments) ? body.downPayments.map(Number).filter((value) => value > 0 && value < 100) : [],
    durations: Array.isArray(body.durations) ? body.durations.map(Number).filter((value) => value > 0 && value <= 60) : [],
    images,
    image: images[0]?.url ?? (String(body.image ?? "").startsWith("/") || /^https:\/\//i.test(String(body.image ?? "")) ? String(body.image) : ""),
    status: body.status ?? "Available",
  };
}

export async function GET(request) {
  try {
    await connectDB();
    await ensureCatalogSeeded();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    if (!validTypes.has(type)) return NextResponse.json({ error: "Choose used or installment phones." }, { status: 400 });

    if (searchParams.get("admin") === "1" && !(await getAdmin())) return unauthorizedAdminResponse();
    const filter = { type };
    if (searchParams.get("admin") !== "1") filter.status = "Available";
    const products = await Product.find(filter).sort({ createdAt: -1 }).limit(250).lean();
    return NextResponse.json({ products: products.map(serializeProduct) });
  } catch (error) {
    console.error("Catalog products read failed:", error.message);
    return NextResponse.json({ error: "Could not load phone listings." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await getAdmin())) return unauthorizedAdminResponse();

    const body = await request.json();
    const validationError = validateProduct(body);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    await connectDB();
    const product = await Product.create(pickProductFields(body));
    return NextResponse.json({ product: serializeProduct(product) }, { status: 201 });
  } catch (error) {
    console.error("Catalog product create failed:", error.message);
    return NextResponse.json({ error: "Could not save this phone." }, { status: 500 });
  }
}


