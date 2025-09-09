import container from "@/config/dependency";
import { IUserService } from "@/users/user.type";
import { User } from "@/users/user.entity";
import { connectTestDB, disconnectTestDB } from "@/core/db/connection";
import { after, before, describe, test } from "node:test";
import assert from "node:assert";
import { deleteModelWithClass, getModelForClass } from "@typegoose/typegoose";
import UserService from "@/users/user.service";
import { createUserFixture } from "@/test/mock/user.mock";

describe("UserService", () => {
  let userService: IUserService;
  const prefix = "user_service";

  before(async () => {
    const conn = await connectTestDB(prefix);
    const child = container.createChildContainer();
    deleteModelWithClass(User);
    child.register("UserModel", {
      useValue: getModelForClass(User, {
        existingConnection: conn,
      }),
    });
    userService = child.resolve<IUserService>(UserService);
  });

  test("should throw error if email is missing", async () => {
    const userData = createUserFixture(prefix);
    userData.email = "";

    await assert.rejects(
      async () => {
        await userService.create(userData);
      },
      (err: any) => {
        assert.strictEqual(err.name, "ValidationError");
        assert.ok(err.errors.email);
        assert.strictEqual(err.errors.email.kind, "required");
        return true;
      }
    );
  });

  test("should throw error if username is missing", async () => {
    const userData = createUserFixture(prefix);
    userData.userName = "";

    await assert.rejects(
      async () => {
        await userService.create(userData);
      },
      (err: any) => {
        assert.strictEqual(err.name, "ValidationError");
        assert.ok(err.errors.userName);
        assert.strictEqual(err.errors.userName.kind, "required");
        return true;
      }
    );
  });

  test("should throw error if password is missing", async () => {
    const userData = createUserFixture(prefix);
    userData.password = "";

    await assert.rejects(
      async () => {
        await userService.create(userData);
      },
      (err: any) => {
        assert.strictEqual(err.name, "ValidationError");
        assert.ok(err.errors.password);
        assert.strictEqual(err.errors.password.kind, "required");
        return true;
      }
    );
  });

  test("should create user successfully", async () => {
    const userData = createUserFixture(prefix);

    const user = await userService.create(userData);

    assert.ok(user._id);
    assert.strictEqual(user.email, userData.email);
    assert.strictEqual(user.profilePicture, userData.profilePicture);
    assert.strictEqual(user.password, userData.password);
    assert.equal(user.dateOfBirth, userData.dateOfBirth);
  });

  test("should throw duplicate key error if username already exists", async () => {
    const userData = createUserFixture(prefix);

    await assert.rejects(
      async () => {
        await userService.create(userData);
      },
      (err: any) => {
        assert.strictEqual(err.code, 11000);
        assert.strictEqual(err.keyPattern.userName, 1);
        assert.strictEqual(err.keyValue.userName, userData.userName);
        return true;
      }
    );
  });

  after(async () => {
    await disconnectTestDB(prefix);
  });
});
