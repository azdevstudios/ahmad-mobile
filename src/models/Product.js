import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, default: "" },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["used", "installment"], required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    brand: { type: String, required: true, trim: true, maxlength: 50 },
    code: { type: String, trim: true, default: "", maxlength: 60 },
    storage: { type: mongoose.Schema.Types.Mixed, default: "" },
    condition: { type: String, trim: true, default: "" },
    pta: { type: String, trim: true, default: "" },
    price: { type: Number, required: true, min: 1 },
    colors: { type: [String], default: [] },
    downPayments: { type: [Number], default: [] },
    durations: { type: [Number], default: [] },
    images: { type: [imageSchema], default: [] },
    image: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Available", "Reserved", "Sold", "Draft"],
      default: "Available",
    },
  },
  { timestamps: true }
);

productSchema.index({ type: 1, createdAt: -1 });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
