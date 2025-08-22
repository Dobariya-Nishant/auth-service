import { User } from "@/users/users.entity";

export enum UserRoles {
  ADMIN = "admin",
  USER = "user",
}

export type UserQuery = {
  _id?: string;
  userName?: string;
  email?: string;
};

export type GetUsersQuery = {
  lastCreatedAt?: Date;
};

export interface IUsersService {
  getOne(query: UserQuery): Promise<User>;

  get(query: GetUsersQuery): Promise<Array<User>>;

  update(userId: string, data: Partial<User>): Promise<User>;

  create(data: User): Promise<User>;

  delete(userId: string): Promise<User>;
}

export interface IUsersRepository {
  getOne(query: UserQuery): Promise<User | null>;

  get(query: GetUsersQuery): Promise<Array<User>>;

  create(data: User): Promise<User>;

  update(query: UserQuery, data: Partial<User>): Promise<User | null>;

  delete(userId: UserQuery): Promise<User | null>;
}
