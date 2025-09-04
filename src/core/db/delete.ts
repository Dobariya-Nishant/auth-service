import mongoose from "mongoose";
const { collections } = mongoose.connection;

export async function dropCollections() {
  for (const key of Object.keys(collections)) {
    const collection = collections[key];
    await collection.drop().catch((err) => {
      // ignore error if collection already gone
      if (err.code !== 26) throw err;
    });
  }
  console.log("all collections deleted");
}
