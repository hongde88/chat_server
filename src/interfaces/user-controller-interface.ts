export interface IUserController {
  createUser(userInfo): Promise<void>;
  verifyUserPasscode(userInfo): Promise<boolean>;
  verifyUserLogin(userInfo): Promise<boolean>;
  forgetPassword(userInfo): Promise<void>;
  changePassword(userInfo): Promise<void>;
  verifyUserEmail(userInfo): Promise<void>;
}