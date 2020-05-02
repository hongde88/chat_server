export default class Constants {
  static VERIFICATION_SUBJECT = 'LDSocial Register Verification Passcode';
  static VERIFICATION_TEXT = 'Your verification passcode is';
  static EMAIL_ALREADY_EXISTS = 'Email already exists';
  static EMAIL_NOT_REGISTERED = 'This email is not registered yet';
  static CHECK_EMAIL_MSG = 'Please include a valid email';
  static CHECK_PASSCODE_MSG = 'Please enter a valid passcode';
  static PASSCODE_INVALID_MSG = 'Invalid passcode';
  static CHECK_PASSWORD_MSG = 'Please enter a password with 8 or more characters';
  static INTERNAL_SERVER_ERROR = {
    message: 'An internal server error occurred'
  };
  static GENERIC_SUCCESS_MSG = 'Success';
  static PASSWORD_INVALID_MSG = 'Invalid password';
  static ACCT_NOT_VERIFIED = 'Account is not verified through email yet';
}