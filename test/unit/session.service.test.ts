import { test, before, after, describe } from "node:test";
import assert from "node:assert";
import { disconnectTestDB } from "@/core/db/connection";
import { ISessionService } from "@/auth/auth.types";
import { createJwtPayload } from "@/test/mock/user.mock";
import { SessionError } from "@/auth/auth.message";
import { getContainer } from "@/test/mock/childcontainer";

describe("SessionService", () => {
  let sessionService: ISessionService;
  const prefix = "session_service";

  before(async () => {
    const child = await getContainer(prefix);
    sessionService = child.resolve<ISessionService>("ISessionService");
  });

  test("should throw ValidationError when creating session without userId", async () => {
    const jwtPayload = createJwtPayload();
    //@ts-ignore
    delete jwtPayload.userId;

    await assert.rejects(
      () => sessionService.create(jwtPayload),
      (err: any) => {
        assert.strictEqual(err.name, "ValidationError");
        assert.ok(err.errors.userId);
        assert.strictEqual(err.errors.userId.kind, "required");
        return true;
      }
    );
  });

  test("should create a new session and return valid access/refresh tokens", async () => {
    const jwtPayload = createJwtPayload();

    const tokens = await sessionService.create(jwtPayload);

    const session = await sessionService.getOne({
      userId: jwtPayload.userId,
      refreshToken: tokens.refreshToken,
    });

    assert.ok(tokens.accessToken, "accessToken should be returned");
    assert.ok(tokens.refreshToken, "refreshToken should be returned");
    assert.strictEqual(typeof tokens.accessToken, "string");
    assert.strictEqual(tokens.refreshToken, session.refreshToken);
    assert.strictEqual(typeof tokens.refreshToken, "string");
    const [header, payload] = tokens.accessToken.split(".");
    assert.ok(header);
    assert.ok(payload);
  });

  test("should verify both access token and refresh token successfully", async () => {
    const jwtPayload = createJwtPayload();

    const tokens = await sessionService.create(jwtPayload);

    const accessTokenPayload = sessionService.verifySessionToken(
      tokens.accessToken,
      false
    );

    const refreshTokenPayload = await sessionService.verify(
      tokens.refreshToken
    );

    assert.strictEqual(accessTokenPayload?.userId, jwtPayload.userId);
    assert.strictEqual(accessTokenPayload?.authType, jwtPayload.authType);
    assert.strictEqual(accessTokenPayload?.oauthToken, jwtPayload.oauthToken);
    assert.strictEqual(refreshTokenPayload?.userId, jwtPayload.userId);
    assert.strictEqual(refreshTokenPayload?.authType, jwtPayload.authType);
    assert.strictEqual(refreshTokenPayload?.oauthToken, jwtPayload.oauthToken);
  });

  test("should update session with a new refresh token and invalidate the old one", async () => {
    const jwtPayload = createJwtPayload();

    const tokens = await sessionService.create(jwtPayload);

    const session = await sessionService.getOne({
      userId: jwtPayload.userId,
      refreshToken: tokens.refreshToken,
    });

    assert.ok(session?._id, "session not exist");

    const updatedTokens = await sessionService.update({
      userId: jwtPayload.userId,
      refreshToken: tokens.refreshToken,
    });

    const updatedSession = await sessionService.getOne({
      userId: jwtPayload.userId,
      refreshToken: updatedTokens.refreshToken,
    });

    assert.strictEqual(
      updatedTokens?.refreshToken,
      updatedSession?.refreshToken
    );

    await assert.rejects(
      () =>
        sessionService.getOne({
          userId: jwtPayload.userId,
          refreshToken: tokens.refreshToken,
        }),
      (err: any) => {
        assert.strictEqual(err.name, "NotFoundError");
        assert.strictEqual(err.statusCode, 404);
        assert.strictEqual(err.message, SessionError.NotFound);
        return true;
      }
    );
  });

  test("should allow multiple active sessions for the same user and keep them isolated", async () => {
    const jwtPayload = createJwtPayload();

    const tokens1 = await sessionService.create(jwtPayload);
    const tokens2 = await sessionService.create(jwtPayload);

    assert.notStrictEqual(
      tokens1.refreshToken,
      tokens2.refreshToken,
      "refresh tokens should be unique per session"
    );

    const session1 = await sessionService.getOne({
      userId: jwtPayload.userId,
      refreshToken: tokens1.refreshToken,
    });

    const session2 = await sessionService.getOne({
      userId: jwtPayload.userId,
      refreshToken: tokens2.refreshToken,
    });

    assert.ok(session1, "first session should exist");
    assert.ok(session2, "second session should exist");
  });

  test("should delete a session successfully by userId + refreshToken", async () => {
    const jwtPayload = createJwtPayload();

    const tokens = await sessionService.create(jwtPayload);

    const session = await sessionService.getOne({
      userId: jwtPayload.userId,
      refreshToken: tokens.refreshToken,
    });

    assert.ok(session?._id, "session not exist");

    await sessionService.delete({
      userId: jwtPayload.userId,
      refreshToken: tokens.refreshToken,
    });

    await assert.rejects(
      () =>
        sessionService.getOne({
          userId: jwtPayload.userId,
          refreshToken: tokens.refreshToken,
        }),
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
