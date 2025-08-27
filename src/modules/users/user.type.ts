import { User } from "@/users/user.entity";

export enum UserRoles {
  ADMIN = "admin",
  USER = "user",
}

export type UserQuery = {
  userId?: string;
  userName?: string;
  email?: string;
};

export type MultiUserQuery = {
  limit?: number;
  lastCreatedAt?: Date;
};

export interface IUserService {
  getOne(query: UserQuery): Promise<User>;

  get(query: MultiUserQuery): Promise<Array<User>>;

  update(query: UserQuery, data: Partial<User>): Promise<User>;

  create(data: User): Promise<User>;

  delete(query: UserQuery): Promise<User>;
}

export interface IUserRepository {
  getOne(query: UserQuery): Promise<User | null>;

  get(query: MultiUserQuery): Promise<Array<User>>;

  create(data: User): Promise<User>;

  update(query: UserQuery, data: Partial<User>): Promise<User | null>;

  delete(userId: UserQuery): Promise<User | null>;
}
