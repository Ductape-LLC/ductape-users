import { NextFunction, Request, response, Response, Router } from "express";
import UsersService from "../services/users.service";
import SUCCESS from "../commons/successResponse";
import ERROR from "../commons/errorResponse";
import UserSchema from "../validators/users.validator.create";
import UserUpdateSchema from "../validators/users.validator.update";
import TemporaryUserSchema from "../validators/users.validator.temporaryuser";
import ChangePasswordSchema from "../validators/users.validator.changepassword";
import changePasswordSchema from "../validators/users.validator.change-password";
import LoginSchema from "../validators/users.validator.login";
import OTPLoginSchema from "../validators/users.validator.otplogin";
import AuthKeyLoginSchema from "../validators/users.validator.authkeylogin";
import ForgotSchema from "../validators/users.validators.forgotpassword";
import { extractError, stripAuth } from "../utils/users.utils.string";
import { genericErrors, users } from "../types/users.type";
import { ObjectId } from "mongoose";
import { validateModuleRequest } from "../middleware/users.middleware.modules";
import { validateUserAccess } from "../middleware/users.middleware.access";
import passport from 'passport';
require('../passports/google.passport')

const router = Router();
const usersService = new UsersService();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as users;
    console.log('USER', user)
    const result = await usersService.loginUserAccount(user, {});
      return res.status(201).json(SUCCESS(result));
  }
);

// create new user
router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;

      await UserSchema.validateAsync(body);

      const result = await usersService.createUserAccount(body);
      return res.status(201).json(SUCCESS(result));
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/update",
  validateUserAccess,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body, user } = req;
      const { _id } = user as users


      await UserUpdateSchema.validateAsync(body);
      const result = await usersService.updateUserAccount(body, _id as unknown as string);

      return res.status(201).json(SUCCESS(result));
    } catch (e) {
      console.log(e)
      next(e);
    }
  }
);


router.post(
  "/create-temporary-user",
  validateModuleRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      await TemporaryUserSchema.validateAsync(body);
      const result = await usersService.createTemporary(body);
      return res.status(201).json(SUCCESS(result));
    } catch (e) {
      next(e);
    }
  }
);

// login
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body, query } = req;

      await LoginSchema.validateAsync(body);

      const result = await usersService.loginUserAccount(body, query);
      return res.status(201).json(SUCCESS(result));
    } catch (e) {
      next(e);
    }
  }
);

// login
router.post(
  "/login/authKey",
  async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;

      await AuthKeyLoginSchema.validateAsync(body);

      const result = await usersService.loginUserAccountAuthKey(body);
      return res.status(201).json(SUCCESS(result));
    } catch (e) {
      next (e);
    }
  }
)

// change password
router.put(
  "/password",
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { body } = req;

      await ChangePasswordSchema.validateAsync(body);
      const { token, email, password } = body;

      const result = await usersService.changePassword(token, email, password );

      return res.status(201).json(SUCCESS(result));

    } catch(e) {
      if(process.env.NODE_ENV !== "production") console.log("EERRRROOORRR!!!!", e);
      next(e);
    }
  }
)

router.put(
  "/change-password",
  validateUserAccess,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body, user } = req;
      const { email } = user as users

      await changePasswordSchema.validateAsync(body);

      const { oldPassword, newPassword, confirmNewPassword } = body;

      if (newPassword !== confirmNewPassword) throw 'Passwords do not match.';

      const result = await usersService.changeUserPassword(email, oldPassword, newPassword);

      return res.status(200).json(SUCCESS(result));

    } catch(e) {
      if(process.env.NODE_ENV !== "production") console.log("EERRRROOORRR!!!!", e);
      return res.status(400).json(ERROR(e));
    }
  }
)


router.post(
  "/login/otp",
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { body } = req;

      await OTPLoginSchema.validateAsync(body);
      const { token, user_id } = body;

      const result = await usersService.otpLogin(token, user_id as unknown as ObjectId);

      return res.status(201).json(SUCCESS(result));

    } catch(e) {
      if(process.env.NODE_ENV !== "production") console.log("EERRRROOORRR!!!!", e);
      next(e);
    }
  }
)

// request new email otp
router.post(
  "/otp/:user_id", 
  async(req: Request, res: Response, next: NextFunction) => {
    try {

      const {params} = req;
      const {user_id} = params;

      const result = await usersService.regenerateLoginOTP(user_id as unknown as ObjectId);
      return res.status(201).json(SUCCESS(result));

    } catch(e) {
      if(process.env.NODE_ENV !== "production") console.log("ERRRORRRRRR!!!!",e);
      next(e);
    }
  }
)


// fetch information of token holder
router.get("/me", validateUserAccess, async (req: Request, res: Response, next: NextFunction) => {

  try {

    const { user } = req;
    const { _id } = user as users

    console.log(_id)

    return res.status(201).json(SUCCESS(await usersService.findByUserId(_id as unknown as string)));

  } catch (e) {
    if(process.env.NODE_ENV !== "production") console.log("EERRRROOORRR!!!!", e);
    next(e);
  }

});

// process forgot password
router.post(
  "/forgot",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;

      await ForgotSchema.validateAsync(body);

      const { email } = body;

      const result = await usersService.generateResetUserPassword(email);
      return res.status(201).json(SUCCESS(result));
    } catch (e) {
      next(e);
    }
  }
);

// confirm user endpoint
router.get(
  "/confirm/:confirm_id/:token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { params } = req;
      const { confirm_id, token } = params

      const result = await usersService.confirmUserAccount(token, confirm_id as unknown as ObjectId);

      if (result) {
        return res.status(200).json(SUCCESS("Account Confirmed"))
      }

    } catch (e) {
      next(e);
    }
  }
)

// validate other domains access
router.post(
  "/validate/access",
  validateModuleRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { body } = req;
      const { token, user_id, public_key } = body;

      const result = await usersService.validatePublicKeyJWT(token, user_id, public_key);

      return res.status(200).json(SUCCESS(result))

    } catch (e) {
      next(e);
    }
  }
)

// validate module request
router.get(
  "/users/email",
  validateModuleRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req;
      const { email } = query;

      if (!email) return res.status(400).json(ERROR("email is required"))

      const result = await usersService.findByEmail(email as unknown as string);
      return res.status(200).json(SUCCESS(result))

    } catch (e) {
      next(e);
    }
  }
)
export default router;