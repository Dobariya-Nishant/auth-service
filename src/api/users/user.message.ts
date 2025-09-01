export enum UserError {
  NotFound = "User not found",
  Unauthorized = "User is not authorized",
  Forbidden = "User is not allowed to access this resource",
  Conflict = "User name or Email is already in use",
}

export enum UserSuccess {
  SentOne = "User sent successfully",
  SentMany = "Users sent successfully",
  Created = "User created successfully",
  Updated = "User updated successfully",
  Deleted = "User deleted successfully",
}
