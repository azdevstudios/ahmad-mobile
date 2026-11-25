import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin"], default: "admin" },
    sessionVersion: { type: Number, default: 0 },
    setupSlot: { type: String, default: "primary", unique: true, immutable: true },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export default Admin;
