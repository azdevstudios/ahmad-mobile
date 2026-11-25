import { NextResponse } from "next/server";
import mongoose from "mongoose";
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

function normalize(body) {
  if (!body || !validTypes.has(body.type) || !body.name?.trim() || !body.brand?.trim()) return { error: "Phone name, brand and category are required." };
  if (!Number.isFinite(Number(body.price)) || Number(body.price) < 1) return { error: "Enter a valid phone price." };
  if (body.status && !validStatuses.has(body.status)) return { error: "Select a valid phone status." };
  if (body.images !== undefined && (!Array.isArray(body.images) || body.images.length > 5 || body.images.some((image) => !image?.url || !(image.url.startsWith("/") || /^https:\/\//i.test(image.url))))) {
    return { error: "Add up to five photos using local paths or HTTPS URLs." };
  }
  const images = (body.images ?? []).map((image) => ({ url: image.url, publicId: image.publicId ?? "", width: Number(image.width) || null, height: Number(image.height) || null }));
  return { value: {
    type: body.type,
    name: body.name.trim(),
    brand: body.brand.trim(),
    code: String(body.code ?? "").trim(),
    storage: body.type === "used" ? String(body.storage ?? "").trim() : (Array.isArray(body.storage) ? body.storage : []),
    condition: String(body.condition ?? "").trim(),
    pta: String(body.pta ?? "").trim(),
    price: Number(body.price),
    colors: Array.isArray(body.colors) ? body.colors : [],
    downPayments: Array.isArray(body.downPayments) ? body.downPayments.map(Number).filter((value) => value > 0 && value < 100) : [],
    durations: Array.isArray(body.durations) ? body.durations.map(Number).filter((value) => value > 0 && value <= 60) : [],
    images,
    image: images[0]?.url ?? (String(body.image ?? "").startsWith("/") || /^https:\/\//i.test(String(body.image ?? "")) ? String(body.image) : ""),
    status: body.status ?? "Available",
  } };
}

export async function PATCH(request, { params }) {
  try {
    if (!(await getAdmin())) return unauthorizedAdminResponse();

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Phone not found." }, { status: 404 });
    const body = await request.json();
    const normalized = normalize(body);
    if (normalized.error) return NextResponse.json({ error: normalized.error }, { status: 400 });
    await connectDB();
    const product = await Product.findByIdAndUpdate(id, normalized.value, { new: true, runValidators: true });
    if (!product) return NextResponse.json({ error: "Phone not found." }, { status: 404 });
    return NextResponse.json({ product: serializeProduct(product) });
  } catch (error) {
    console.error("Catalog product update failed:", error.message);
    return NextResponse.json({ error: "Could not update this phone." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    if (!(await getAdmin())) return unauthorizedAdminResponse();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Phone not found." }, { status: 404 });
    await connectDB();
    await ensureCatalogSeeded();
    const product = await Product.findByIdAndDelete(id);
    if (!product) return NextResponse.json({ error: "Phone not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Catalog product delete failed:", error.message);
    return NextResponse.json({ error: "Could not delete this phone." }, { status: 500 });
  }
}



