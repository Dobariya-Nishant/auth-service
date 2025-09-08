import { test, before, after, describe } from "node:test";
import assert from "node:assert";
import container from "@/config/dependency";
import { User } from "@/users/user.entity";
import { Session } from "@/auth/session.entity";
import { connectTestDB, disconnectTestDB } from "@/core/db/connection";
import { IAuthService, ISessionService } from "@/auth/auth.types";
import { IUserService } from "@/users/user.type";
import { compare } from "bcrypt";
import { UserError } from "@/users/user.message";
import { deleteModelWithClass, getModelForClass } from "@typegoose/typegoose";
import { createLoginFixture, createUserFixture } from "@/test/mock/user.mock";
import { SessionError } from "@/auth/auth.message";

describe("AuthService", () => {
  let authService: IAuthService;
  let userService: IUserService;
  let sessionService: ISessionService;

  before(async () => {
    const conn = await connectTestDB("authservice");
    const child = container.createChildContainer();
    deleteModelWithClass(User);
    deleteModelWithClass(Session);
    child.register("UserModel", {
      useValue: getModelForClass(User, {
        existingConnection: conn,
      }),
    });
    child.register("SessionModel", {
      useValue: getModelForClass(Session, {
        existingConnection: conn,
      }),
    });
    authService = child.resolve<IAuthService>("IAuthService");
    userService = child.resolve<IUserService>("IUserService");
    sessionService = child.resolve<ISessionService>("ISessionService");
  });

  test("sign-up validation", async () => {
    const userData = createUserFixture("auth_service");
    userData.email = "";
    userData.userName = "";

    await assert.rejects(
      async () => {
        await authService.signUp(userData);
      },
      (err: any) => {
        console.log(err.errors.userName);
        assert.strictEqual(err.name, "ValidationError");
        assert.ok(err.errors.email);
        assert.strictEqual(err.errors.email.kind, "required");
        assert.ok(err.errors.userName);
        assert.strictEqual(err.errors.userName.kind, "required");
        return true;
      }
    );
  });

  test("should sign-up successfully", async () => {
    const userData = createUserFixture("auth_service");
    const password = userData.password;

    const tokens = await authService.signUp(userData);

    assert.ok(tokens.accessToken, "accessToken should be returned");
    assert.ok(tokens.refreshToken, "refreshToken should be returned");
    assert.strictEqual(typeof tokens.accessToken, "string");
    assert.strictEqual(typeof tokens.refreshToken, "string");
    const [header, payload] = tokens.accessToken.split(".");
    assert.ok(header);
    assert.ok(payload);

    const user = await userService.getOne({ email: userData.email });

    assert.ok(user, "User should exist after sign-up");
    assert.ok(user._id, "_id not added in user");
    assert.ok(user.role, "role is not assigned by default");
    assert.strictEqual(user.userName, userData.userName);
    assert.strictEqual(user.email, userData.email);
    assert.strictEqual(user.profilePicture, userData.profilePicture);
    assert.notStrictEqual(user.password, password);
    assert.partialDeepStrictEqual(user.dateOfBirth, userData.dateOfBirth);
    assert.ok(user?.createdAt, "createdAt date not added in user");
    assert.ok(user?.updatedAt, "updatedAt date not added in user");
    assert.ok(user?.fullName, "fullName not added in user");
  });

  test("should hash password before saving", async () => {
    const userData = createUserFixture("auth_service");

    const user = await userService.getOne({ email: userData.email });

    assert.notStrictEqual(user?.password, userData.password);
    const isMatch = await compare(userData.password, user?.password || "");
    assert.ok(isMatch, "Password hash should match the original password");
  });

  test("should throw error if username is already taken", async () => {
    const userData = createUserFixture("auth_service");
    userData.email = "";

    await assert.rejects(
      async () => {
        await authService.signUp(userData);
      },
      (err: any) => {
        assert.strictEqual(err.name, "ConflictError");
        assert.strictEqual(err.statusCode, 409);
        assert.strictEqual(err.message, UserError.Conflict);
        return true;
      }
    );
  });

  test("should throw error if email is already taken", async () => {
    const userData = createUserFixture("auth_service");
    userData.userName = "";

    await assert.rejects(
      async () => {
        await authService.signUp(userData);
      },
      (err: any) => {
        assert.strictEqual(err.name, "ConflictError");
        assert.strictEqual(err.statusCode, 409);
        assert.strictEqual(err.message, UserError.Conflict);
        return true;
      }
    );
  });

  test("should not able login with wrong password", async () => {
    const loginPayload = createUserFixture("auth_service");
    loginPayload.password = "1234";

    await assert.rejects(
      async () => {
        await authService.login(loginPayload);
      },
      (err: any) => {
        assert.strictEqual(err.name, "UnauthorizedError");
        assert.strictEqual(err.statusCode, 401);
        assert.strictEqual(err.message, UserError.Unauthorized);
        return true;
      }
    );
  });

  test("should not able login with wrong email", async () => {
    const loginPayload = createLoginFixture("auth_service");
    loginPayload.email = "test@example.co";
    delete loginPayload.userName;

    await assert.rejects(
      async () => {
        await authService.login(loginPayload);
      },
      (err: any) => {
        assert.strictEqual(err.name, "NotFoundError");
        assert.strictEqual(err.statusCode, 404);
        assert.strictEqual(err.message, UserError.NotFound);
        return true;
      }
    );
  });

  test("should not able login with wrong username", async () => {
    const loginPayload = createLoginFixture("auth_service");
    loginPayload.email = "";
    loginPayload.userName = "testuse";

    await assert.rejects(
      async () => {
        await authService.login(loginPayload);
      },
      (err: any) => {
        assert.strictEqual(err.name, "NotFoundError");
        assert.strictEqual(err.statusCode, 404);
        assert.strictEqual(err.message, UserError.NotFound);
        return true;
      }
    );
  });

  test("should login successfully with valid username & password", async () => {
    const loginPayload = createLoginFixture("auth_service");
    loginPayload.email = "";

    const tokens = await authService.login(loginPayload);

    assert.ok(tokens.accessToken, "accessToken should be returned");
    assert.ok(tokens.refreshToken, "refreshToken should be returned");
    assert.strictEqual(typeof tokens.accessToken, "string");
    assert.strictEqual(typeof tokens.refreshToken, "string");
    const [header, payload] = tokens.accessToken.split(".");
    assert.ok(header);
    assert.ok(payload);
  });

  test("should login successfully with valid email & password", async () => {
    const loginPayload = createLoginFixture("auth_service");
    loginPayload.userName = "";

    const tokens = await authService.login(loginPayload);

    assert.ok(tokens.accessToken, "accessToken should be returned");
    assert.ok(tokens.refreshToken, "refreshToken should be returned");
    assert.strictEqual(typeof tokens.accessToken, "string");
    assert.strictEqual(typeof tokens.refreshToken, "string");
    const [header, payload] = tokens.accessToken.split(".");
    assert.ok(header);
    assert.ok(payload);
  });

  test("ckeck login and logout flow", async () => {
    const loginPayload = createLoginFixture("auth_service");
    loginPayload.userName = "";

    const user = await userService.getOne({ email: loginPayload.email });

    assert.ok(user?._id, "user not exist");

    const tokens = await authService.login(loginPayload);

    assert.strictEqual(typeof tokens.accessToken, "string");
    assert.strictEqual(typeof tokens.refreshToken, "string");

    const session = await sessionService.getOne({
      userId: user._id,
      refreshToken: tokens.refreshToken,
    });

    assert.strictEqual(tokens.refreshToken, session.refreshToken);

    // await authService.logout(user._id, tokens.refreshToken);

    await assert.rejects(
      async () => {
        const session = await sessionService.getOne({
          userId: user._id,
          refreshToken: tokens.refreshToken,
        });
        console.log("session", session);
      },
      (err: any) => {
        assert.strictEqual(err.name, "NotFoundError");
        assert.strictEqual(err.statusCode, 404);
        assert.strictEqual(err.message, SessionError.NotFound);
        return true;
      }
    );
  });

  after(async () => {
    await disconnectTestDB("authservice");
  });
});
