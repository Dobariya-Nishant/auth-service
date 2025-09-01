import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import { User } from "@/users/user.entity";
import { IAuthService, Tokens } from "@/auth/auth.types";
import { UnauthorizedError } from "@/core/utils/errors";
import { AuthError, AuthSuccess } from "@/auth/auth.message";

const ACCESS_COOKIE_OPTS = {
  path: "/api/v1/",
  httpOnly: true,
  secure: true,
  signed: true,
};

const REFRESH_COOKIE_OPTS = {
  path: "/api/v1/auth/",
  httpOnly: true,
  secure: true,
  signed: true,
};

@injectable()
export default class AuthController {
  constructor(@inject("IAuthService") private authService: IAuthService) {}

  private extractRefreshToken(req: FastifyRequest): string | null {
    if (req.cookies?.refreshToken) {
      const unsigned = req.unsignCookie(req.cookies.refreshToken);

      if (unsigned.valid && unsigned.value) {
        return unsigned.value;
      }
    }

    if ((req?.body as any)?.refreshToken) {
      return (req.body as any).refreshToken;
    }

    return null;
  }

  private authResponse(res: FastifyReply, tokens: Tokens) {
    return res
      .code(200)
      .setCookie("accessToken", tokens.accessToken, ACCESS_COOKIE_OPTS)
      .setCookie("refreshToken", tokens.refreshToken, REFRESH_COOKIE_OPTS)
      .send({
        message: AuthSuccess.Login,
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        statusCode: 200,
      });
  }

  async login(req: FastifyRequest, res: FastifyReply) {
    const tokens = await this.authService.login(req.body as any);

    return this.authResponse(res, tokens);
  }

  async signUp(req: FastifyRequest, res: FastifyReply) {
    const tokens = await this.authService.signUp(req.body as User);

    return this.authResponse(res, tokens);
  }

  async refresh(req: FastifyRequest, res: FastifyReply) {
    const refreshToken = this.extractRefreshToken(req);

    if (!refreshToken) {
      throw new UnauthorizedError(AuthError.RefreshNotFound);
    }

    const tokens = await this.authService.refresh(refreshToken);

    return this.authResponse(res, tokens);
  }

  async logout(req: FastifyRequest, res: FastifyReply) {
    const userId = req?.user?._id;

    const refreshToken = this.extractRefreshToken(req);

    if (!refreshToken) {
      throw new UnauthorizedError(AuthError.RefreshNotFound);
    }

    await this.authService.logout(userId!, refreshToken);

    return res
      .code(200)
      .clearCookie("accessToken", ACCESS_COOKIE_OPTS)
      .clearCookie("refreshToken", REFRESH_COOKIE_OPTS)
      .send({
        message: AuthSuccess.Logout,
        statusCode: 200,
      });
  }
}
