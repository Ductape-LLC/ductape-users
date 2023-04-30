import { NextFunction, Request, response, Response, Router } from "express";
import UsersService from "../services/users.service";
import SUCCESS from "../commons/successResponse";
import ERROR from "../commons/errorResponse";
import UserSchema from "../validators/users.validator.create";
import ChangePasswordSchema from "../validators/users.validator.changepassword";
import LoginSchema from "../validators/users.validator.login";
import OTPLoginSchema from "../validators/users.validator.otplogin";
import ForgotSchema from "../validators/users.validators.forgotpassword";
import { extractError, stripAuth } from "../utils/users.utils.string";
import { genericErrors } from "../types/users.type";
import { ObjectId } from "mongoose";
import { validateModuleRequest } from "../middleware/users.middleware.modules";

const router = Router();
const usersService = new UsersService();

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
      const error = extractError(e as unknown as genericErrors);
      return res.status(500).json(ERROR(error));
    }
  }
);

// login
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;

      await LoginSchema.validateAsync(body);

      const result = await usersService.loginUserAccount(body);
      if(process.env.NODE_ENV !== "production") console.log("SUCCESSS!!!!", result);
      return res.status(201).json(SUCCESS(result));
    } catch (e) {
      if(process.env.NODE_ENV !== "production") console.log("EERRRROOORRR!!!!", e);
      const error = extractError(e as unknown as genericErrors);
      return res.status(500).json(ERROR(error));
    }
  }
);

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
      const error = extractError(e as unknown as genericErrors);
      return res.status(500).json(ERROR(error));
    }
  }
)

// login with otp
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
      const error = extractError(e as unknown as genericErrors);
      return res.status(500).json(ERROR(error));
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
      const error = extractError(e as unknown as genericErrors);
      return res.status(500).json(ERROR(error));
    }
  }
)


// fetch information of token holder
router.get("/me", async (req: Request, res: Response, next: NextFunction) => {

  try {

    const { body, query, params } = req;
    const auth_token = req.headers["x-access-token"] as string || req.headers["authorization"] as string;

    if (!auth_token) return res.status(401).json(ERROR("Missing Auth Token"));

    const token = stripAuth(auth_token);
    let { public_key, user_id } = body;

    if (!user_id) user_id = params.user_id || query.user_id;
    if (!public_key) public_key = params.public_key || query.public_key;


    await usersService.validatePublicKeyJWT(token, user_id, public_key);

    return res.status(201).json(SUCCESS(await usersService.findByUserId(user_id)));

  } catch (e) {
    if(process.env.NODE_ENV !== "production") console.log("EERRRROOORRR!!!!", e);
    const error = extractError(e as unknown as genericErrors);
    return res.status(500).json(ERROR(error));
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
      const error = extractError(e as unknown as genericErrors);
      return res.status(500).json(ERROR(error));
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
      const error = extractError(e as unknown as genericErrors);
      return res.status(500).json(ERROR(error))
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
      const error = extractError(e as unknown as genericErrors);
      return res.status(500).json(ERROR(error.toString()))
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
      const error = extractError(e as unknown as genericErrors);
      return res.status(500).json(ERROR(error.toString()))
    }
  }
)
export default router;