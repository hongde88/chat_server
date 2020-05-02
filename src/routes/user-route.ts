import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import Constants from '../helpers/constants';
import { IUserController } from '../interfaces/user-controller-interface';
import { UserController } from '../controllers/user-controller';

const router = Router();

/**
 * @throw
 * Constants.EMAIL_ALREADY_EXISTS
 * Constants.ACCT_NOT_VERIFIED
 * Constants.INTERNAL_SERVER_ERROR
 */
router.post('/register', [
  check('email', Constants.CHECK_EMAIL_MSG).isEmail(),
  check('password', Constants.CHECK_PASSWORD_MSG).isLength({ min: 8 })
], async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  try {
    const userController: IUserController = new UserController();
    await userController.createUser(req.body);
    return res.send(Constants.GENERIC_SUCCESS_MSG);
  } catch (err) {
    if (err.message) {
      return res.status(409).json(err);
    } else {
      return res.status(500).json(Constants.INTERNAL_SERVER_ERROR);
    }
  }
});

/**
 * @throw
 * Constants.EMAIL_NOT_REGISTERED
 * Constants.PASSCODE_INVALID_MSG
 * Constants.INTERNAL_SERVER_ERROR
 */
router.post('/verify-passcode', [
  check('email', Constants.CHECK_EMAIL_MSG).isEmail(),
  check('passcode', Constants.CHECK_PASSCODE_MSG).isNumeric()
], async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  try {
    const userController: IUserController = new UserController();
    const isVerified = await userController.verifyUserPasscode(req.body);

    if (isVerified) {
      return res.send(Constants.GENERIC_SUCCESS_MSG);
    } else {
      return res.status(400).send(Constants.PASSCODE_INVALID_MSG);
    }
  } catch (err) {
    if (err.message) {
      return res.status(412).json(err);
    } else {
      return res.status(500).json(Constants.INTERNAL_SERVER_ERROR);
    }
  }
});

/**
 * @throw
 * Constants.EMAIL_NOT_REGISTERED
 * Constants.INTERNAL_SERVER_ERROR
 */
router.post('/verify-email', [
  check('email', Constants.CHECK_EMAIL_MSG).isEmail(),
  check('passcode', Constants.CHECK_PASSCODE_MSG).isNumeric()
], async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  try {
    const userController: IUserController = new UserController();
    await userController.verifyUserEmail(req.body);
    return res.send(Constants.GENERIC_SUCCESS_MSG);
  } catch (err) {
    if (err.message) {
      return res.status(412).json(err);
    } else {
      return res.status(500).json(Constants.INTERNAL_SERVER_ERROR);
    }
  }
});

/**
 * @throw
 * Constants.EMAIL_NOT_REGISTERED
 * Constants.ACCT_NOT_VERIFIED
 * Constants.PASSWORD_INVALID_MSG
 * Constants.INTERNAL_SERVER_ERROR
 */
router.post('/login', [
  check('email', Constants.CHECK_EMAIL_MSG).isEmail(),
  check('password', Constants.CHECK_PASSWORD_MSG).isLength({ min: 8 })
], async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  try {
    const userController: IUserController = new UserController();
    const isVerified = await userController.verifyUserLogin(req.body);

    if (isVerified) {
      return res.send(Constants.GENERIC_SUCCESS_MSG);
    } else {
      return res.status(400).send(Constants.PASSWORD_INVALID_MSG);
    }
  } catch (err) {
    if (err.message) {
      return res.status(412).json(err);
    } else {
      return res.status(500).json(Constants.INTERNAL_SERVER_ERROR);
    }
  }
});

/**
 * @throw
 * Constants.EMAIL_NOT_REGISTERED
 * Constants.INTERNAL_SERVER_ERROR
 */
router.post('/forgot-password', [
  check('email', Constants.CHECK_EMAIL_MSG).isEmail()
], async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  try {
    const userController: IUserController = new UserController();
    await userController.forgetPassword(req.body);
  } catch (err) {
    if (err.message) {
      return res.status(412).json(err);
    } else {
      return res.status(500).json(Constants.INTERNAL_SERVER_ERROR);
    }
  }
});

/**
 * @throw
 * Constants.INTERNAL_SERVER_ERROR
 */
router.post('/change-password', async (req: Request, res: Response) => {
  try {
    const userController: IUserController = new UserController();
    await userController.changePassword(req.body);
    return res.send(Constants.GENERIC_SUCCESS_MSG);
  } catch (err) {
    return res.status(500).json(Constants.INTERNAL_SERVER_ERROR);
  }
});

module.exports = router;