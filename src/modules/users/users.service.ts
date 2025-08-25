import { inject, injectable } from "tsyringe";
import {
  IUserRepository,
  IUserService,
  MultiUserQuery,
  UserQuery,
} from "@/users/users.type";
import { User } from "@/users/users.entity";
import { NotFoundError } from "helpers/errors";

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository
  ) {}

  async getOne(query: UserQuery): Promise<User> {
    const user = await this.userRepository.getOne(query);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  get(query: MultiUserQuery): Promise<Array<User>> {
    return this.userRepository.get(query);
  }

  async update(query: UserQuery, data: Partial<User>): Promise<User> {
    const user = await this.userRepository.update(query, data);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  create(user: User): Promise<User> {
    return this.userRepository.create(user);
  }

  async delete(query: UserQuery): Promise<User> {
    const user = await this.userRepository.delete(query);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }
}
