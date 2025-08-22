import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { AuthType } from "@/auth/auth.types";
import { UserRoles } from "@/users/users.type";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "users",
  },
})
export class User {
  @prop()
  public fullName?: string;

  @prop()
  public profilePicture?: string;

  @prop()
  public dateOfBirth?: Date;

  @prop({ required: true, unique: true })
  public userName!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true, enum: AuthType })
  public authType!: AuthType;

  @prop({ required: true, enum: UserRoles, default: UserRoles.USER })
  public role!: UserRoles;

  @prop({ required: true })
  public password!: string;
}

export const UserModel = getModelForClass(User);
