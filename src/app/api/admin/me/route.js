import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import connectDB from "@/lib/database/db";
import Admin from "@/models/Admin";

export async function GET() {
  try {
    const authAdmin = await getAdmin();

    if (!authAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please login first.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const admin = await Admin.findById(authAdmin.adminId)
      .select("name email role createdAt");

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      admin,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin Profile Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
