import { injectable } from "tsyringe";
import { IAuthService } from "@/auth/auth.types";

@injectable()
export default class AuthService implements IAuthService {
  constructor() {}

  login() {}

  signup() {}

  logout() {}
}
