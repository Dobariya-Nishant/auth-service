import { inject, injectable } from "tsyringe";
import { IAuthService } from "@/auth/auth.types";

@injectable()
export default class AuthController {
  constructor(@inject("AuthService") private authService: IAuthService) {}

  login() {}

  signup() {}

  logout() {}
}
