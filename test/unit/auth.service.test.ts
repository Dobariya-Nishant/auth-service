import { test, before, after, describe } from "node:test";
import assert from "node:assert";
import { disconnectTestDB } from "@/core/db/connection";
import { IAuthService, ISessionService } from "@/auth/auth.types";
import { IUserService } from "@/users/user.type";
import { compare } from "bcrypt";
import { UserError } from "@/users/user.message";
import { createLoginFixture, createUserFixture } from "@/test/mock/user.mock";
import { SessionError } from "@/auth/auth.message";
import { getContainer } from "@/test/mock/childcontainer";

describe("AuthService", () => {
  let authService: IAuthService;
  let userService: IUserService;
  let sessionService: ISessionService;
  const prefix = "auth_service";

  before(async () => {
    const child = await getContainer(prefix);
    authService = child.resolve<IAuthService>("IAuthService");
    userService = child.resolve<IUserService>("IUserService");
    sessionService = child.resolve<ISessionService>("ISessionService");
  });

  test("should fail to sign up when required fields are missing", async () => {
    const userData = createUserFixture(prefix);
    userData.email = "";
    userData.userName = "";

    await assert.rejects(
      async () => {
        await authService.signUp(userData);
      },
      (err: any) => {
        assert.strictEqual(err.name, "ValidationError");
        assert.ok(err.errors.email);
        assert.strictEqual(err.errors.email.kind, "required");
        assert.ok(err.errors.userName);
        assert.strictEqual(err.errors.userName.kind, "required");
        return true;
      }
    );
  });

  test("should successfully sign up a new user and return tokens", async () => {
    const userData = createUserFixture(prefix);
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

  test("should hash user password before persisting", async () => {
    const userData = createUserFixture(prefix);

    const user = await userService.getOne({ email: userData.email });

    assert.notStrictEqual(user?.password, userData.password);
    const isMatch = await compare(userData.password, user?.password || "");
    assert.ok(isMatch, "Password hash should match the original password");
  });

  test("should fail to sign up when username already exists", async () => {
    const userData = createUserFixture(prefix);
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

  test("should fail to sign up when email already exists", async () => {
    const userData = createUserFixture(prefix);
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

  test("should fail to log in with incorrect password", async () => {
    const loginPayload = createUserFixture(prefix);
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

  test("should fail to log in with both email and username missing", async () => {
    const loginPayload = createLoginFixture(prefix);
    loginPayload.email = "";
    loginPayload.userName = "";

    await assert.rejects(
      async () => authService.login(loginPayload),
      (err: any) => {
        assert.strictEqual(err.name, "NotFoundError");
        assert.strictEqual(err.statusCode, 404);
        assert.strictEqual(err.message, UserError.NotFound);
        return true;
      }
    );
  });

  test("should fail to log in with non-existing email", async () => {
    const loginPayload = createLoginFixture(prefix);
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

  test("should fail to log in with non-existing username", async () => {
    const loginPayload = createLoginFixture(prefix);
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

  test("should log in successfully using valid username & password", async () => {
    const loginPayload = createLoginFixture(prefix);
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

  test("should log in successfully using valid email & password", async () => {
    const loginPayload = createLoginFixture(prefix);
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

  test("should create a session on login and invalidate it on logout", async () => {
    const loginPayload = createLoginFixture(prefix);
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

    await authService.logout(user._id, tokens.refreshToken);

    await assert.rejects(
      async () => {
        await sessionService.getOne({
          userId: user._id,
          refreshToken: tokens.refreshToken,
        });
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
    await disconnectTestDB(prefix);
  });
});
