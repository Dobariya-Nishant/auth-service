import "reflect-metadata";
import { container } from "tsyringe";
import AuthController from "@/auth/auth.controller";
import UserController from "@/users/user.controller";
import UserService from "@/users/user.service";
import SessionService from "@/auth/session.service";
import AuthService from "@/auth/auth.service";
import UserRepository from "@/users/user.repository";
import SessionRepository from "@/auth/session.repository";
import { SessionModel } from "@/auth/session.entity";
import { UserModel } from "@/users/user.entity";

// controllers registation
container.register("AuthController", {
  useClass: AuthController,
});
container.register("UserController", {
  useClass: UserController,
});

// services registation
container.register("IAuthService", {
  useClass: AuthService,
});
container.register("ISessionService", {
  useClass: SessionService,
});
container.register("IUserService", {
  useClass: UserService,
});

// repositories registation
container.register("IUserRepository", {
  useClass: UserRepository,
});
container.register("ISessionRepository", {
  useClass: SessionRepository,
});

container.register("UserModel", {
  useValue: UserModel,
});
container.register("SessionModel", {
  useValue: SessionModel,
});

export default container;
