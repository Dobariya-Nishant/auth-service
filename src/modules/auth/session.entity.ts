import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";
import { AuthType } from "@/auth/auth.types";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "sessions",
  },
})
export class Session {
  @prop({ required: true })
  public userId!: string;

  @prop({ required: true })
  public refreshToken!: string;

  @prop({ enum: AuthType, default: AuthType.LOCAL })
  public authType!: AuthType;

  @prop()
  public oauthToken?: string;

  @prop({ default: () => new Date(), expires: "30d" })
  public readonly expireAt?: Date;
}

export const SessionModel = getModelForClass(Session);
