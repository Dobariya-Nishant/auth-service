import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
} from "@typegoose/typegoose";
import { UserRoles } from "@/users/users.type";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "users",
  },
})
export class User {
  @prop({ required: true, default: () => new mongoose.Types.ObjectId() })
  public readonly _id!: string;

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

  @prop({ required: true, enum: UserRoles, default: UserRoles.USER })
  public role!: UserRoles;

  @prop({ required: true })
  public password!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

export const UserModel = getModelForClass(User);
