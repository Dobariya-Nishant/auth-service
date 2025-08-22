import { User } from "@/users/users.entity";
import { UserRoles } from "@/users/users.type";
import { Session } from "./session.entity";

export type LoginDto = {
  email?: string;
  userName?: string;
  password: string;
};

export type SignUpDto = Omit<
  User,
  "authType" | "role" | "createdAt" | "updatedAt"
>;

export enum AuthType {
  LOCAL = "local",
  GOOGLE = "google",
}

export type JwtPayload = {
  userName: string;
  email: string;
  role: UserRoles;
  authType: AuthType;
  oauthToken?: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export interface IAuthService {
  login(data: LoginDto): Promise<Tokens>;

  signup(data: SignUpDto): Promise<Tokens>;

  logout(): Promise<void>;
}

export interface ISessionRepository {
  create(data: Session): Promise<Session>;

  update(data: SignUpDto): Promise<Session>;

  delete(): Promise<void>;
}
