import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/database/db";
import StoreService from "@/models/StoreService";
import { getAdmin, unauthorizedAdminResponse } from "@/lib/auth";

const validIcons = new Set(["Smartphone", "RefreshCw", "CalendarCheck", "Wrench", "Headphones", "ShieldCheck"]);
const validStatuses = new Set(["Active", "Hidden"]);

function serializeService(service) {
  const item = typeof service.toObject === "function" ? service.toObject() : service;
  return { ...item, id: String(item._id), _id: undefined, __v: undefined };
}

function normalizeService(body) {
  if (!body?.title?.trim() || !body?.description?.trim()) return { error: "Service title and description are required." };
  if (body.icon && !validIcons.has(body.icon)) return { error: "Choose a valid service icon." };
  if (body.status && !validStatuses.has(body.status)) return { error: "Choose a valid visibility status." };
  return { value: { number: String(body.number ?? "").trim(), title: body.title.trim(), description: body.description.trim(), icon: body.icon ?? "Wrench", status: body.status ?? "Active" } };
}

export async function PATCH(request, { params }) {
  try {
    if (!(await getAdmin())) return unauthorizedAdminResponse();

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Service not found." }, { status: 404 });
    const normalized = normalizeService(await request.json());
    if (normalized.error) return NextResponse.json({ error: normalized.error }, { status: 400 });
    await connectDB();
    const service = await StoreService.findByIdAndUpdate(id, normalized.value, { new: true, runValidators: true });
    if (!service) return NextResponse.json({ error: "Service not found." }, { status: 404 });
    return NextResponse.json({ service: serializeService(service) });
  } catch (error) {
    console.error("Catalog service update failed:", error.message);
    return NextResponse.json({ error: "Could not update this service." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    if (!(await getAdmin())) return unauthorizedAdminResponse();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Service not found." }, { status: 404 });
    await connectDB();
    const service = await StoreService.findByIdAndDelete(id);
    if (!service) return NextResponse.json({ error: "Service not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Catalog service delete failed:", error.message);
    return NextResponse.json({ error: "Could not delete this service." }, { status: 500 });
  }
}



