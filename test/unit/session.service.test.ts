import { test, before, after, describe } from "node:test";
import assert from "node:assert";
import container from "@/config/dependency";
import { Session } from "@/auth/session.entity";
import { connectTestDB, disconnectTestDB } from "@/core/db/connection";
import { ISessionService } from "@/auth/auth.types";
import { deleteModelWithClass, getModelForClass } from "@typegoose/typegoose";
import { createJwtPayload, createUserFixture } from "@/test/mock/user.mock";

describe("SessionService", () => {
  let sessionService: ISessionService;
  const prefix = "session_service";

  before(async () => {
    const conn = await connectTestDB(prefix);
    const child = container.createChildContainer();
    deleteModelWithClass(Session);
    child.register("SessionModel", {
      useValue: getModelForClass(Session, {
        existingConnection: conn,
      }),
    });
    sessionService = child.resolve<ISessionService>("ISessionService");
  });

  test("session userId validation", async () => {
    const jwtPayload = createJwtPayload(prefix);
    //@ts-ignore
    delete jwtPayload.userId;
    //@ts-ignore
    delete jwtPayload.authType;

    await assert.rejects(
      async () => {
        await sessionService.create(jwtPayload);
      },
      (err: any) => {
        assert.strictEqual(err.name, "ValidationError");
        assert.ok(err.errors.userId);
        assert.strictEqual(err.errors.userId.kind, "required");
        return true;
      }
    );
  });

  test("session created successfully", async () => {
    const jwtPayload = createJwtPayload(prefix);

    const tokens = await sessionService.create(jwtPayload);

    assert.ok(tokens.accessToken, "accessToken should be returned");
    assert.ok(tokens.refreshToken, "refreshToken should be returned");
    assert.strictEqual(typeof tokens.accessToken, "string");
    assert.strictEqual(typeof tokens.refreshToken, "string");
    const [header, payload] = tokens.accessToken.split(".");
    assert.ok(header);
    assert.ok(payload);
  });

  after(async () => {
    await disconnectTestDB(prefix);
  });
});
