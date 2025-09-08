import { AuthType, JwtPayload, LoginPayload } from "@/auth/auth.types";
import { User } from "@/users/user.entity";

export function createUserFixture(suffix: string = "sample"): User {
  return {
    fullName: `${suffix}_test`,
    profilePicture: `${suffix}.png`,
    dateOfBirth: new Date("2000-01-01"),
    userName: `${suffix}_test`,
    email: `${suffix}_test@example.com`,
    password: `${suffix}_test`,
  } as User;
}

export function createLoginFixture(suffix: string = "sample"): LoginPayload {
  return {
    userName: `${suffix}_test`,
    email: `${suffix}_test@example.com`,
    password: `${suffix}_test`,
  };
}

export function createJwtPayload(suffix: string = "sample"): JwtPayload {
  return {
    userId: `${suffix}_test`,
    authType: AuthType.LOCAL,
    oauthToken: "",
  };
}
