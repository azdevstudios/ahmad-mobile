import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    number: { type: String, trim: true, default: "" },
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 300 },
    icon: {
      type: String,
      enum: ["Smartphone", "RefreshCw", "CalendarCheck", "Wrench", "Headphones", "ShieldCheck"],
      default: "Wrench",
    },
    status: { type: String, enum: ["Active", "Hidden"], default: "Active" },
  },
  { timestamps: true }
);

serviceSchema.index({ status: 1, number: 1 });

export default mongoose.models.StoreService || mongoose.model("StoreService", serviceSchema);
