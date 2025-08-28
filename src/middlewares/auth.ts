import { UnauthorizedError } from "@/helpers/errors";
import { FastifyReply, FastifyRequest } from "fastify";
import container from "@/config/dependency";
import { IAuthService } from "@/auth/auth.types";

const authService = container.resolve<IAuthService>("IAuthService");

function extractAccessToken(req: FastifyRequest): string | null {
  if (req.cookies?.accessToken) {
    const unsigned = req.unsignCookie(req.cookies.accessToken);

    if (unsigned.valid && unsigned.value) {
      return unsigned.value;
    }
  }

  if ((req?.headers as any)?.authorization) {
    return (req.headers as any).authorization;
  }

  if ((req?.body as any)?.accessToken) {
    return (req.body as any).accessToken;
  }

  return null;
}

export default async function authenticate(
  req: FastifyRequest,
  res: FastifyReply
) {
  const accessToken = extractAccessToken(req);

  if (!accessToken) {
    throw new UnauthorizedError("Missing Authorization header");
  }

  const user = await authService.verify(accessToken);

  req.user = user;
}
