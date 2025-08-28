import { connect, disconnect } from "mongoose";

export async function connectDB() {
  try {
    await connect(process.env.DB_URL || "mongodb://localhost:27017/test");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

export async function disconnectDB() {
  try {
    await disconnect();
    console.log("🔌 MongoDB disconnected");
  } catch (err) {
    console.error("❌ Error disconnecting MongoDB:", err);
  }
}
