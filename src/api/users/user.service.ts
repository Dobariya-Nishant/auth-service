import { inject, injectable } from "tsyringe";
import {
  IUserRepository,
  IUserService,
  MultiUserQuery,
  UserQuery,
} from "@/users/user.type";
import { User } from "@/users/user.entity";
import { NotFoundError } from "@/core/utils/errors";
import { UserError } from "@/users/user.message";

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  getOne(query: UserQuery): Promise<User | null> {
    return this.userRepository.getOne(query);
  }

  get(query: MultiUserQuery): Promise<Array<User>> {
    return this.userRepository.get(query);
  }

  async update(query: UserQuery, data: Partial<User>): Promise<User> {
    const user = await this.userRepository.update(query, data);

    if (!user) {
      throw new NotFoundError(UserError.NotFound);
    }

    return user;
  }

  create(user: User): Promise<User> {
    return this.userRepository.create(user);
  }

  async delete(query: UserQuery): Promise<User> {
    const user = await this.userRepository.delete(query);

    if (!user) {
      throw new NotFoundError(UserError.NotFound);
    }

    return user;
  }
}
