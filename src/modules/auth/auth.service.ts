import { inject, injectable } from "tsyringe";
import { compare, hash } from "bcrypt";
import {
  Tokens,
  IAuthService,
  ISessionService,
  AuthType,
  LoginPayload,
} from "@/auth/auth.types";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@/helpers/errors";
import { User } from "@/users/user.entity";
import { IUserService } from "@/users/user.type";

@injectable()
export default class AuthService implements IAuthService {
  constructor(
    @inject("ISessionService") private sessionService: ISessionService,
    @inject("IUserService") private userService: IUserService
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashed = await hash(password, saltRounds);
    return hashed;
  }

  private async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const match = await compare(password, hashedPassword);
    return match;
  }

  async login(data: LoginPayload): Promise<Tokens> {
    const user = await this.userService.getOne(data);

    if (!user?._id) {
      throw new NotFoundError("User not found");
    }

    const isPasswordValid = await this.verifyPassword(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("credentials are not valid");
    }

    const tokens = await this.sessionService.create({
      userId: user._id,
      authType: AuthType.LOCAL,
    });

    return tokens;
  }

  async signUp(data: User): Promise<Tokens> {
    const isUser = await this.userService.getOne({
      userName: data.userName,
      email: data.email,
    });

    if (isUser) {
      throw new ConflictError("userName or email already in use");
    }

    const hashedPassword = await this.hashPassword(data.password);

    data.password = hashedPassword;

    const user = await this.userService.create(data);

    const tokens = await this.sessionService.create({
      userId: user._id,
      authType: AuthType.LOCAL,
    });

    return tokens;
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.sessionService.delete({
      userId,
      token: refreshToken,
    });
  }
}
