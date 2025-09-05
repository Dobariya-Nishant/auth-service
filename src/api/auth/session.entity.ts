import {
  getModelForClass,
  prop,
  modelOptions,
  Ref,
} from "@typegoose/typegoose";
import { AuthType } from "@/auth/auth.types";
import { User } from "@/users/user.entity";
import { Types } from "mongoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "sessions",
  },
})
export class Session {
  @prop({ required: true, default: () => new Types.ObjectId() })
  public readonly _id?: string;

  @prop({ ref: () => User, required: true })
  public userId!: Ref<User>;

  @prop({ required: true, unique: true })
  public refreshToken!: string;

  @prop({ enum: AuthType, default: AuthType.LOCAL })
  public authType!: AuthType;

  @prop()
  public oauthToken?: string;

  @prop({ default: () => new Date(), expires: "30d" })
  public readonly expireAt?: Date;

  public readonly createdAt?: Date;

  public readonly updatedAt?: Date;
}

export const SessionModel = getModelForClass(Session);
