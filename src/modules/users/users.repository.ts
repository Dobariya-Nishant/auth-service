import { injectable } from "tsyringe";
import { UserQuery, IUserRepository, MultiUserQuery } from "@/users/users.type";
import { User, UserModel } from "@/users/users.entity";

@injectable()
export default class UserRepository implements IUserRepository {
  constructor() {}

  getOne(query: UserQuery): Promise<User | null> {
    return UserModel.findOne({
      $or: [{ userName: query.userName }, { email: query.email }],
    })
      .lean()
      .exec();
  }

  get(query: MultiUserQuery): Promise<Array<User>> {
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
