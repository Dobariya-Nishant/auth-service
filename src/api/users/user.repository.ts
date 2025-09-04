import { inject, injectable } from "tsyringe";
import { UserQuery, IUserRepository, MultiUserQuery } from "@/users/user.type";
import { User } from "@/users/user.entity";
import { Model } from "mongoose";

@injectable()
export default class UserRepository implements IUserRepository {
  constructor(@inject("UserModel") private readonly userModel: Model<User>) {}

  getOne(query: UserQuery): Promise<User | null> {
    return this.userModel
      .findOne({
        $or: [
          { userName: query.userName },
          { email: query.email },
          { _id: query.userId },
        ],
      })
      .lean()
      .exec();
  }

  get(query: MultiUserQuery): Promise<Array<User>> {
    const conditions: any = {};

    if (query.lastCreatedAt) {
      conditions.createdAt = { $lt: query.lastCreatedAt };
    }

    return this.userModel
      .find(conditions)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(query.limit || 0)
      .lean()
      .exec();
  }

  create(data: User): Promise<User> {
    return this.userModel.create(data);
  }

  update(query: UserQuery, data: Partial<User>): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate(query, data, { new: true })
      .lean()
      .exec();
  }

  delete(query: UserQuery): Promise<User | null> {
    return this.userModel.findOneAndDelete(query).lean().exec();
  }
}
