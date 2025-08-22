import { injectable } from "tsyringe";
import { UserQuery, GetUsersQuery, IUsersRepository } from "@/users/users.type";
import { User, UserModel } from "@/users/users.entity";

@injectable()
export default class SessionRepository implements ISessionRepository {
  constructor() {}

  getOne(query: UserQuery): Promise<User | null> {
    return UserModel.findOne(query).lean().exec();
  }

  get(query: GetUsersQuery): Promise<Array<User>> {
    return UserModel.find(query).lean().exec();
  }

  create(data: User): Promise<User> {
    return UserModel.create(data);
  }

  update(query: UserQuery, data: Partial<User>): Promise<User | null> {
    return UserModel.findOneAndUpdate(query, data, { new: true }).lean().exec();
  }

  delete(query: UserQuery): Promise<User | null> {
    return UserModel.findOneAndDelete(query).lean().exec();
  }
}
