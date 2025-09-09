import { mongoose } from "@typegoose/typegoose";

export function getNewObjectId(): string {
  return new mongoose.Types.ObjectId().toString();
}
