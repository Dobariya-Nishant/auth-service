export enum AuthError {
  RefreshNotFound = "Refresh token not found",
}

export enum SessionError {
  NotFound = "Session not found or Expired",
  NotValid = "Session token is not valid",
}

export enum AuthSuccess {
  Login = "Login successfully",
  SignUp = "SignUp successfully",
  Logout = "Logout successfully",
}
