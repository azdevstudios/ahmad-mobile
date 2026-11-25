import mongoose from "mongoose";

const schema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  attempts: { type: Number, default: 0 },
  windowStartedAt: { type: Date, required: true },
  lockedUntil: { type: Date, default: null },
  expiresAt: { type: Date, required: true },
});
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AdminLoginAttempt = mongoose.models.AdminLoginAttempt ||
  mongoose.model("AdminLoginAttempt", schema);
export default AdminLoginAttempt;
