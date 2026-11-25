import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import StoreService from "@/models/StoreService";
import { ensureCatalogSeeded } from "@/lib/catalog/seed";
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
  return { value: {
    number: String(body.number ?? "").trim(),
    title: body.title.trim(),
    description: body.description.trim(),
    icon: body.icon ?? "Wrench",
    status: body.status ?? "Active",
  } };
}

export async function GET(request) {
  try {
    await connectDB();
    await ensureCatalogSeeded();
    const includeHidden = new URL(request.url).searchParams.get("includeHidden") === "1";
    if (includeHidden && !(await getAdmin())) return unauthorizedAdminResponse();
    const filter = includeHidden ? {} : { status: "Active" };
    const services = await StoreService.find(filter).sort({ number: 1, createdAt: 1 }).lean();
    return NextResponse.json({ services: services.map(serializeService) });
  } catch (error) {
    console.error("Catalog services read failed:", error.message);
    return NextResponse.json({ error: "Could not load services." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await getAdmin())) return unauthorizedAdminResponse();

    const body = await request.json();
    const normalized = normalizeService(body);
    if (normalized.error) return NextResponse.json({ error: normalized.error }, { status: 400 });
    await connectDB();
    const service = await StoreService.create(normalized.value);
    return NextResponse.json({ service: serializeService(service) }, { status: 201 });
  } catch (error) {
    console.error("Catalog service create failed:", error.message);
    return NextResponse.json({ error: "Could not save this service." }, { status: 500 });
  }
}


