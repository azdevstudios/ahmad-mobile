import mongoose from "mongoose";

const adminPasswordResetSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);
adminPasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AdminPasswordReset = mongoose.models.AdminPasswordReset ||
  mongoose.model("AdminPasswordReset", adminPasswordResetSchema);

export default AdminPasswordReset;
