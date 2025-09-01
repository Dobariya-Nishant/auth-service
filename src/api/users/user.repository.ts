import { injectable } from "tsyringe";
import { UserQuery, IUserRepository, MultiUserQuery } from "@/users/user.type";
import { User, UserModel } from "@/users/user.entity";

@injectable()
export default class UserRepository implements IUserRepository {
  constructor() {}

  getOne(query: UserQuery): Promise<User | null> {
    return UserModel.findOne({
      $or: [
        { userName: query.userName },
        { email: query.email },
        { _id: query.userId },
      ],
    })
      .select("-password")
      .lean()
      .exec();
  }

  get(query: MultiUserQuery): Promise<Array<User>> {
    const conditions: any = {};

    if (query.lastCreatedAt) {
      conditions.createdAt = { $lt: query.lastCreatedAt };
    }

    return UserModel.find(conditions)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(query.limit || 0)
      .lean()
      .exec();
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
