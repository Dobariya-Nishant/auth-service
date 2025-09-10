import { IUserService } from "@/users/user.type";
import { disconnectTestDB } from "@/core/db/connection";
import { after, before, describe, test } from "node:test";
import assert from "node:assert";
import UserService from "@/users/user.service";
import { createUserFixture } from "@/test/mock/user.mock";
import { getContainer } from "@/test/mock/childcontainer";

describe("UserService", () => {
  let userService: IUserService;
  const prefix = "user_service";

  before(async () => {
    const child = await getContainer(prefix);
    userService = child.resolve<IUserService>(UserService);
  });

  test("should throw error if required fields are missing", async () => {
    const userData = createUserFixture(prefix);
    userData.email = "";
    userData.userName = "";
    userData.password = "";

    await assert.rejects(
      async () => {
        await userService.create(userData);
      },
      (err: any) => {
        assert.strictEqual(err.name, "ValidationError");
        assert.ok(err.errors.email);
        assert.strictEqual(err.errors.email.kind, "required");
        assert.ok(err.errors.userName);
        assert.strictEqual(err.errors.userName.kind, "required");
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
    assert.strictEqual(user.userName, userData.userName);
    assert.strictEqual(user.profilePicture, userData.profilePicture);
    assert.strictEqual(user.password, userData.password);
    assert.partialDeepStrictEqual(user.dateOfBirth, userData.dateOfBirth);
  });

  test("should get created user with email and userName", async () => {
    const userData = createUserFixture(prefix);

    const user = await userService.getOne({
      email: userData.email,
      userName: userData.userName,
    });

    assert.ok(user);
    assert.ok(user._id);
    assert.strictEqual(user.email, userData.email);
    assert.strictEqual(user.userName, userData.userName);
    assert.strictEqual(user.profilePicture, userData.profilePicture);
    assert.strictEqual(user.password, userData.password);
    assert.partialDeepStrictEqual(user.dateOfBirth, userData.dateOfBirth);
  });

  test("should throw duplicate key error if username already exists", async () => {
    const userData = createUserFixture(prefix);
    userData.email = "test@email.com";

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

  test("should throw duplicate key error if email already exists", async () => {
    const userData = createUserFixture(prefix);
    userData.userName = "test_user";

    await assert.rejects(
      async () => {
        await userService.create(userData);
      },
      (err: any) => {
        assert.strictEqual(err.code, 11000);
        assert.strictEqual(err.keyPattern.email, 1);
        assert.strictEqual(err.keyValue.email, userData.email);
        return true;
      }
    );
  });

  test("should update user", async () => {
    const userData = createUserFixture(prefix);
    const updateData = createUserFixture("update");

    const updatedUser = await userService.update(
      { email: userData.email },
      updateData
    );

    assert.ok(updatedUser._id);
    assert.strictEqual(updatedUser.email, updateData.email);
    assert.strictEqual(updatedUser.userName, updateData.userName);
    assert.strictEqual(updatedUser.fullName, updateData.fullName);
    assert.strictEqual(updatedUser.profilePicture, updateData.profilePicture);
    assert.strictEqual(updatedUser.password, updateData.password);
    assert.partialDeepStrictEqual(
      updatedUser.dateOfBirth,
      updateData.dateOfBirth
    );
  });

  test("should delete user from db", async () => {
    const userData = createUserFixture("update");

    await userService.delete({ email: userData.email });

    const user = await userService.getOne({ email: userData.email });

    //@ts-ignore
    assert.notEqual(user?.email, userData.email);
  });

  after(async () => {
    await disconnectTestDB(prefix);
  });
});
