import * as bcrypt from 'bcrypt';
import { IUserController } from "../interfaces/user-controller-interface";
import Constants from '../helpers/constants';
import Mailer from '../helpers/mailer';
import User from '../models/user';
import Utils from '../helpers/utils';

export class UserController implements IUserController {
  async createUser(userInfo: any): Promise<void> {
    const user = await User.findOne({ email: userInfo.email });

    if (user) {
      const isVerified = (user as any).isVerified;

      if (isVerified) {
        throw {
          message: Constants.EMAIL_ALREADY_EXISTS,
          email: userInfo.email
        };
      } else {
        throw {
          message: Constants.ACCT_NOT_VERIFIED,
          email: userInfo.email
        };
      }
    } else {
      const newUser = new User({
        email: userInfo.email,
        password: userInfo.password
      });

      const salt = await bcrypt.genSalt(10);

      (newUser as any).password = await bcrypt.hash(userInfo.password, salt);
      (newUser as any).passcode = Utils.generate6DigitRandomNumber();
      (newUser as any).isVerified = false;

      await newUser.save();
      await this.sendVerificationEmail((newUser as any).passcode, userInfo.email);
    }
  }

  async forgetPassword(userInfo: any): Promise<void> {
    const user = await User.findOne({ email: userInfo.email });

    if (!user) {
      throw {
        message: Constants.EMAIL_NOT_REGISTERED,
        email: userInfo.email
      };
    } else {
      (user as any).passcode = Utils.generate6DigitRandomNumber();
      (user as any).isVerified = false;
      await user.save();
      await this.sendVerificationEmail((user as any).passcode, userInfo.email);
    }
  }

  private async sendVerificationEmail(passcode, email) {
    const mailer = Mailer.getInstance();
    await mailer.sendMail(
      email,
      Constants.VERIFICATION_SUBJECT,
      `${Constants.VERIFICATION_TEXT} ${passcode}`
    );
  }

  async verifyUserPasscode(userInfo: any): Promise<boolean> {
    const user = await User.findOne({ email: userInfo.email });

    if (!user) {
      throw {
        message: Constants.EMAIL_NOT_REGISTERED,
        email: userInfo.email
      };
    } else {
      const savedPasscode = (user as any).passcode;

      if (userInfo.passcode !== savedPasscode) {
        return false;
      } else {
        (user as any).isVerified = true;
        await user.save();
        return true;
      }
    }
  }

  async verifyUserEmail(userInfo: any): Promise<void> {
    const user = await User.findOne({ email: userInfo.email });

    if (!user) {
      throw {
        message: Constants.EMAIL_NOT_REGISTERED,
        email: userInfo.email
      };
    } else {
      (user as any).passcode = Utils.generate6DigitRandomNumber();
      (user as any).isVerified = false;
      await user.save();
      await this.sendVerificationEmail((user as any).passcode, userInfo.email);
    }
  }

  async verifyUserLogin(userInfo: any): Promise<boolean> {
    const user = await User.findOne({ email: userInfo.email });

    if (!user) {
      throw {
        message: Constants.EMAIL_NOT_REGISTERED,
        email: userInfo.email
      };
    }

    const isVerified = (user as any).isVerified;

    if (!isVerified) {
      throw {
        message: Constants.ACCT_NOT_VERIFIED,
        email: userInfo.email
      };
    }

    const passwordMatched = await bcrypt.compare(userInfo.password, (user as any).password);

    return passwordMatched;
  }

  async changePassword(userInfo: any): Promise<void> {
    const user = await User.findOne({ email: userInfo.email });

    if (!user) {
      throw Constants.INTERNAL_SERVER_ERROR;
    }

    const salt = await bcrypt.genSalt(10);

    (user as any).password = await bcrypt.hash(userInfo.password, salt);

    await user.save();
  }
}