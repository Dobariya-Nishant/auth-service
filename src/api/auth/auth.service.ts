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
} from "@/core/utils/errors";
import { User } from "@/users/user.entity";
import { IUserService } from "@/users/user.type";
import { UserError } from "@/users/user.message";

@injectable()
export default class AuthService implements IAuthService {
  constructor(
    @inject("ISessionService") private sessionService: ISessionService,
    @inject("IUserService") private userService: IUserService
  ) {}

  private hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return hash(password, saltRounds);
  }

  private verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  async login(data: LoginPayload): Promise<Tokens> {
    const user = await this.userService.getOne({
      email: data.email,
      userName: data.userName,
    });

    if (!user?._id) {
      throw new NotFoundError(UserError.NotFound);
    }

    const isPasswordValid = await this.verifyPassword(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError(UserError.Unauthorized);
    }

    const tokens = await this.sessionService.create({
      userId: user._id,
      authType: AuthType.LOCAL,
    });

    return tokens;
  }

  async refresh(refreshToken: string): Promise<Tokens> {
    const payload = await this.sessionService.verify(refreshToken);

    const tokens = await this.sessionService.update({
      userId: payload.userId,
      refreshToken,
    });

    return tokens;
  }

  async verify(accessToken: string): Promise<User> {
    const payload = this.sessionService.verifySessionToken(accessToken, false);

    const user = await this.userService.getOne({ userId: payload.userId });

    if (!user) {
      throw new UnauthorizedError(UserError.Unauthorized);
    }

    return user;
  }

  async signUp(data: User): Promise<Tokens> {
    const isUser = await this.userService.getOne({
      userName: data.userName,
      email: data.email,
    });

    if (isUser) {
      throw new ConflictError(UserError.Conflict);
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
      refreshToken: refreshToken,
    });
  }
}
