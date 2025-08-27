import { inject, injectable } from "tsyringe";
import { FastifyReply, FastifyRequest } from "fastify";
import { User } from "@/users/user.entity";
import { IAuthService } from "@/auth/auth.types";
import { UnauthorizedError } from "@/helpers/errors";

@injectable()
export default class AuthController {
  constructor(@inject("IAuthService") private authService: IAuthService) {}

  async login(req: FastifyRequest, res: FastifyReply) {
    const tokens = await this.authService.login(req.body as User);

    return res
      .code(200)
      .setCookie("accessToken", tokens.accessToken)
      .setCookie("refreshToken", tokens.refreshToken)
      .send({
        message: "login successful",
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        statusCode: 200,
      });
  }

  async signUp(req: FastifyRequest, res: FastifyReply) {
    const tokens = await this.authService.signUp(req.body as User);

    return res
      .code(200)
      .setCookie("accessToken", tokens.accessToken)
      .setCookie("refreshToken", tokens.refreshToken)
      .send({
        message: "sign-up successful",
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        statusCode: 200,
      });
  }

  async logout(req: FastifyRequest, res: FastifyReply) {
    const userId = req?.user?._id;

    const refreshToken = req.unsignCookie("refreshToken");

    if (!refreshToken.valid || !refreshToken.value) {
      throw new UnauthorizedError("Session not exist or Expired");
    }

    await this.authService.logout(userId!, refreshToken.value);

    return res
      .code(200)
      .clearCookie("refreshToken")
      .clearCookie("accessToken")
      .send({
        message: "logout successful",
        statusCode: 200,
      });
  }
}
