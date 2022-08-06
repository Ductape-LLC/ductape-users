import { NextFunction, Request, response, Response, Router } from "express";
import UsersService from "../services/users.service";
import SUCCESS from "../commons/successResponse";
import ERROR from "../commons/errorResponse";
import UserSchema from "../validators/users.validator.create";
import LoginSchema from "../validators/users.validator.login";
import ForgotSchema from "../validators/users.validators.forgotpassword";
  import { extractError } from "../utils/users.utils.string";
import { genericErrors } from "../types/users.type";
import { ObjectId } from "mongoose";
import { validateModuleRequest } from "../middleware/users.middleware.modules";

const router = Router();
const usersService = new UsersService();

router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;

      const { error } = await UserSchema.validateAsync(body);
      if (error) return res.status(400).json(ERROR(error))

      const result = await usersService.createUserAccount(body);
      return res.status(201).json(SUCCESS(result));
    } catch (e) {
      const error = extractError(e as unknown as genericErrors);
      return res.status(500).json(ERROR(error));
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;

      const { error } = await LoginSchema.validateAsync(body);
      if (error) return res.status(400).json(ERROR(error))

      const result = await usersService.loginUserAccount(body);
      console.log("SUCCESSS!!!!", result);
      return res.status(201).json(SUCCESS(result));
    } catch (e) {
      console.log("EERRRROOORRR!!!!", e);
      const error = extractError(e as unknown as genericErrors);
      return res.status(500).json(ERROR(error));
    }
  }
);

router.post(
  "/forgot",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;

      const { error } = await ForgotSchema.validateAsync(body);
      if (error) return res.status(400).json(ERROR(error));

      const { email } = body;

      const result = await usersService.generateResetUserPassword(email);
      return res.status(201).json(SUCCESS(result));
    } catch (e) {
      const error = extractError(e as unknown as genericErrors);
      return res.status(500).json(ERROR(error));
    }
  }
);

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

router.post(
  "/validate/access",
  validateModuleRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try{

      const { body } = req;
      const {token, user_id, public_key} = body;

      const result = await usersService.validatePublicKeyJWT(token, user_id, public_key);

      return res.status(200).json(SUCCESS(result))

    } catch (e) {
      const error = extractError(e as unknown as genericErrors);
      return res.status(500).json(ERROR(error.toString()))
    }
  }
)

export default router;