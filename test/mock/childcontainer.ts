import container from "@/config/dependency";
import { connectTestDB } from "@/core/db/connection";
import { User } from "@/users/user.entity";
import { Session } from "@/auth/session.entity";
import { deleteModelWithClass, getModelForClass } from "@typegoose/typegoose";

export async function getContainer(prefix: string) {
  const conn = await connectTestDB(prefix);

  const child = container.createChildContainer();

  deleteModelWithClass(User);
  deleteModelWithClass(Session);

  const UserModel = getModelForClass(User, {
    existingConnection: conn,
  });
  const SessionModel = getModelForClass(Session, {
    existingConnection: conn,
  });

  await UserModel.ensureIndexes();
  await SessionModel.ensureIndexes();

  child.register("UserModel", {
    useValue: UserModel,
  });
  child.register("SessionModel", {
    useValue: SessionModel,
  });

  return child;
}
