import { Session } from "@/auth/session.entity";
import { User } from "@/users/user.entity";

export type LoginPayload = {
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
  authType: AuthType;
  oauthToken?: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type SessionQuery = {
  userId: string;
  refreshToken: string;
};

export type MultiSessionQuery = {
  userId: string;
  createdAt?: Date;
  limit?: number;
};

export interface IAuthService {
  login(data: LoginPayload): Promise<Tokens>;

  signUp(data: User): Promise<Tokens>;

  refresh(refreshToken: string): Promise<Tokens>;

  verify(accessToken: string): Promise<User>;

  logout(userId: string, refreshToken: string): Promise<void>;
}

export interface ISessionService {
  verifySessionToken(token: string, isRefresh: boolean): JwtPayload;

  get(query: MultiSessionQuery): Promise<Session[]>;

  getOne(query: SessionQuery): Promise<Session>;

  create(payload: JwtPayload): Promise<Tokens>;

  verify(refreshToken: string): Promise<JwtPayload>;

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
