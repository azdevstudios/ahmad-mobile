import mongoose from "mongoose";

const catalogSeedSchema = new mongoose.Schema(
  { key: { type: String, required: true, unique: true } },
  { timestamps: true }
);

export default mongoose.models.CatalogSeed || mongoose.model("CatalogSeed", catalogSeedSchema);
