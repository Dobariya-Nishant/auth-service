import { inject, injectable } from "tsyringe";
import { sign, verify } from "jsonwebtoken";
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
import { NotFoundError, UnauthorizedError } from "@/helpers/errors";

@injectable()
export default class SessionService implements ISessionService {
  constructor(
    @inject("ISessionRepository")
    private sessionRepository: ISessionRepository
  ) {}

  private generateSessionTokens(jwtPayload: JwtPayload): Tokens {
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

  private verifySessionToken(token: string, isRefresh: boolean): JwtPayload {
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
    query.limit = 20;
    return this.sessionRepository.get(query);
  }

  async getOne(query: SessionQuery): Promise<Session> {
    const session = await this.sessionRepository.getOne(query);

    if (!session) {
      throw new NotFoundError("Session Not Found or Expired!!");
    }

    return session;
  }

  async verify(query: SessionQuery): Promise<JwtPayload> {
    const session = await this.getOne(query);

    return this.verifySessionToken(session.refreshToken, true);
  }

  async create(payload: JwtPayload): Promise<Tokens> {
    const tokens = this.generateSessionTokens(payload);

    const session: Session = {
      userId: payload.userId,
      refreshToken: tokens.refreshToken,
      authType: payload.authType,
      oauthToken: payload.authType,
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
      throw new UnauthorizedError("Session not Found!");
    }

    return tokens;
  }

  async delete(query: SessionQuery): Promise<void> {
    await this.sessionRepository.delete(query);
  }
}
