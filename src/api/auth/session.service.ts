import { inject, injectable } from "tsyringe";
import { sign, verify, decode } from "jsonwebtoken";
import {
  AuthType,
  ISessionRepository,
  ISessionService,
  JwtPayload,
  MultiSessionQuery,
  SessionQuery,
  Tokens,
} from "@/auth/auth.types";
import { Session } from "@/auth/session.entity";
import { NotFoundError, UnauthorizedError } from "@/core/utils/errors";
import { SessionError } from "@/auth/auth.message";

@injectable()
export default class SessionService implements ISessionService {
  constructor(
    @inject("ISessionRepository")
    private sessionRepository: ISessionRepository
  ) {}

  private extractUserId(token: string): string {
    const decoded = decode(token) as JwtPayload | null;

    if (!decoded?.userId) {
      throw new UnauthorizedError(SessionError.NotValid);
    }

    return decoded?.userId;
  }

  private generateSessionTokens(jwtPayload: JwtPayload): Tokens {
    //@ts-ignore
    jwtPayload.jti = crypto.randomUUID();

    const accessToken = sign(
      jwtPayload,
      process.env.PRIVATE_ACCESS_TOKEN_KEY as string,
      {
        expiresIn: "1d",
        algorithm: "RS256",
      }
    );

    const refreshToken = sign(
      jwtPayload,
      process.env.PRIVATE_REFRESH_TOKEN_KEY as string,
      {
        expiresIn: "7d",
        algorithm: "RS256",
      }
    );

    return { accessToken, refreshToken };
  }

  verifySessionToken(token: string, isRefresh: boolean): JwtPayload {
    let key: string;

    if (isRefresh) {
      key = process.env.PUBLIC_REFRESH_TOKEN_KEY as string;
    } else {
      key = process.env.PUBLIC_ACCESS_TOKEN_KEY as string;
    }

    const payload = verify(token, key, {
      algorithms: ["RS256"],
    });

    return payload as JwtPayload;
  }

  get(query: MultiSessionQuery): Promise<Session[]> {
    if (!query?.limit) query.limit = 20;
    return this.sessionRepository.get(query);
  }

  async getOne(query: SessionQuery): Promise<Session> {
    const session = await this.sessionRepository.getOne(query);

    if (!session) {
      throw new NotFoundError(SessionError.NotFound);
    }

    return session;
  }

  async verify(refreshToken: string): Promise<JwtPayload> {
    try {
      const payload = this.verifySessionToken(refreshToken, true);

      await this.getOne({
        refreshToken,
        userId: payload.userId,
      });

      return payload;
    } catch (err) {
      const userId = this.extractUserId(refreshToken);

      await this.delete({
        refreshToken,
        userId,
      });

      throw err;
    }
  }

  async create(payload: JwtPayload): Promise<Tokens> {
    const tokens = this.generateSessionTokens(payload);

    const session: Session = {
      userId: payload.userId,
      refreshToken: tokens.refreshToken,
      authType: payload.authType,
      oauthToken: payload.oauthToken,
    };

    await this.sessionRepository.create(session);

    return tokens;
  }

  async update(query: SessionQuery): Promise<Tokens> {
    const tokens = this.generateSessionTokens({
      userId: query.userId,
      authType: AuthType.LOCAL,
    });

    const sessionUpdate: Partial<Session> = {
      refreshToken: tokens.refreshToken,
    };

    const session = await this.sessionRepository.update(query, sessionUpdate);

    if (!session) {
      throw new NotFoundError(SessionError.NotFound);
    }

    return tokens;
  }

  async delete(query: SessionQuery): Promise<void> {
    await this.sessionRepository.delete(query);
  }
}
