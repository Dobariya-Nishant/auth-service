import { Session } from "@/auth/session.entity";
import { User } from "@/users/users.entity";

export type Login = {
  email?: string;
  userName?: string;
  password: string;
};

export enum AuthType {
  LOCAL = "local",
  GOOGLE = "google",
}

export type JwtPayload = {
  userId: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type SessionQuery = {
  userId: string;
  token: string;
};

export type MultiSessionQuery = {
  userId: string;
  createdAt?: Date;
  limit?: number;
};

export interface IAuthService {
  hashPassword(password: string): Promise<string>;

  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;

  login(data: Login): Promise<Tokens>;

  signUp(data: User): Promise<Tokens>;

  logout(userId: string, refreshToken: string): Promise<void>;
}

export interface ISessionService {
  generateSessionTokens(jwtPayload: JwtPayload): Tokens;

  verifySessionToken(token: string, isRefresh: boolean): JwtPayload;

  get(query: MultiSessionQuery): Promise<Session[]>;

  getOne(query: SessionQuery): Promise<Session>;

  create(
    userId: string,
    authType: AuthType,
    oauthToken?: string
  ): Promise<Tokens>;

  update(query: SessionQuery): Promise<Tokens>;

  delete(query: SessionQuery): Promise<void>;
}

export interface ISessionRepository {
  getOne(query: SessionQuery): Promise<Session | null>;

  get(query: MultiSessionQuery): Promise<Array<Session>>;

  create(data: Session): Promise<Session>;

  update(query: SessionQuery, data: Partial<Session>): Promise<Session | null>;

  delete(query: SessionQuery): Promise<void>;
}
