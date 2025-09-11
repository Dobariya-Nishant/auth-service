import { mongoose } from "@typegoose/typegoose";
import { Connection } from "mongoose";

export async function connectDB(dbName = "test") {
  try {
    const mongoHost = process.env.MONGO_HOST || "db";
    const mongoUser = process.env.MONGO_USER || "admin";
    const mongoPassword = process.env.MONGO_PASSWORD || "testx";
    const mongoPort = process.env.MONGO_PORT || "27017";

    const uri = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${dbName}?authSource=admin`;
    console.log("process.env.MONGO_URI", process.env.MONGO_URI);

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  } catch (err) {
    console.error("❌ Error disconnecting MongoDB:", err);
  }
}

const connections: Record<string, Connection> = {};

export async function connectTestDB(dbName: string): Promise<Connection> {
  if (connections[dbName]) {
    return connections[dbName];
  }
  const mongoHost = process.env.MONGO_HOST || "db";
  const mongoUser = process.env.MONGO_USER || "admin";
  const mongoPassword = process.env.MONGO_PASSWORD || "testx";
  const mongoPort = process.env.MONGO_PORT || "27017";

  const uri = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${dbName}?authSource=admin`;
  const conn = mongoose.createConnection(uri);

  await conn.asPromise();
  await conn?.db?.command({ ping: 1 });

  console.log(
    `🌱 Connected to test DB: ${conn.name}, readyState=${conn.readyState}`
  );

  connections[dbName] = conn;

  return conn;
}

export async function disconnectTestDB(dbName: string) {
  const conn = connections[dbName];
  if (conn) {
    await conn.dropDatabase();
    await conn.close();
    delete connections[dbName];
    console.log(`🔌 Disconnected from test DB: ${dbName}`);
  }
}
