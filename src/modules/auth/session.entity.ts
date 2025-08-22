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

  @prop({ enum: AuthType })
  public authType?: AuthType;

  @prop()
  public oauthToken?: string;
}

export const SessionModel = getModelForClass(Session);
