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
import { genericErrors, OauthServices, users } from "../types/users.type";
import { ObjectId } from "mongoose";
import { validateModuleRequest } from "../middleware/users.middleware.modules";
import { validateUserAccess } from "../middleware/users.middleware.access";
import { encrypt } from "ductape-sdk/dist/processor/utils/processor.utils";
import passport from 'passport';
import '../passports/google.passport';
import '../passports/github.passport';
import '../passports/linkedIn.passport';
import dotenv from 'dotenv';
import PermissionService from "../services/permissions.service";
import { BasePermissions, permissionType } from "../types/permission.type";
import CreatePermissionSchema from "../validators/permissions.validator.create";
import UpdatePermissionSchema from "../validators/permissions.validator.update";
import CreateRoleSchema from "../validators/roles.validator.create";
import UpdateRoleSchema from "../validators/roles.validator.update";
import { requirePermissions } from "../middleware/users.middleware.permissions";
import PaystackService from "../services/paystack.service";
import CustomerCreateSchema from "../validators/paystack-customer.validator.create"
import { checkSubscriptionExpiration } from "../middleware/users.middleware.subscription";
import BillingInfoCreateSchema from "../validators/billing.validator.create";
import BillingInfoUpdateService from "../validators/billing.validator.update";

dotenv.config();


const router = Router();
const usersService = new UsersService();
const permissionsService = new PermissionService();
const paystackService = new PaystackService();

let baseurl = "https://cloud.ductape.app";

if (process.env.NODE_ENV !== "development") {
  baseurl = "https://cloud.ductape.app";
}

// OAuth Services
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: process.env.DUCTAPE_SIGNIN_URL }),
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as users;

    const result = await usersService.loginUserAccount(user, {}, OauthServices.GOOGLE);
    if (result) {
      console.log(process.env.LOGIN_ENC_KEY);
      const encryptedSessionData = encrypt(JSON.stringify(result), String(process.env.LOGIN_ENC_KEY));
      return res.redirect(302, `${baseurl}/auth/login?loggedIn=true&token=${encryptedSessionData}`)
    } else {
      return res.redirect(302, `${baseurl}/auth/login?loggedIn=false`);
    }
  }
);

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: process.env.DUCTAPE_SIGNIN_URL }),
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as users;

    const result = await usersService.loginUserAccount(user, {}, OauthServices.GITHUB);
    if (result) {
      const encryptedSessionData = encrypt(JSON.stringify(result), String(process.env.LOGIN_ENC_KEY));
      return res.redirect(302, `${baseurl}/auth/login?loggedIn=true&token=${encryptedSessionData}`)
    } else {
      return res.redirect(302, `${baseurl}/auth/login?loggedIn=false`);
    }
  }
);

router.get('/auth/linkedin', passport.authenticate('linkedin', { scope: ['openid', 'profile', 'email'], }));

router.get(
  '/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    session: false,
    failureRedirect: process.env.DUCTAPE_SIGNIN_URL
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as users;
    console.log(user);
    const result = await usersService.loginUserAccount(user, {}, OauthServices.LINKEDIN);
    if (result) {
      const encryptedSessionData = encrypt(JSON.stringify(result), String(process.env.LOGIN_ENC_KEY));
      return res.redirect(302, `${baseurl}/auth/login?loggedIn=true&token=${encryptedSessionData}`)
    } else {
      return res.redirect(302, `${baseurl}/auth/login?loggedIn=false`);
    }
  }
);

// router.get(
//   "/auth/linkedin",
//   async (req: Request, res: Response, next: NextFunction) => {
//     console.log("Some string");
//     res.send("Something");
//   }
// );

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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;

      await AuthKeyLoginSchema.validateAsync(body);

      const result = await usersService.loginUserAccountAuthKey(body);
      return res.status(201).json(SUCCESS(result));
    } catch (e) {
      next(e);
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

      const result = await usersService.changePassword(token, email, password);

      return res.status(201).json(SUCCESS(result));

    } catch (e) {
      if (process.env.NODE_ENV !== "production") console.log("EERRRROOORRR!!!!", e);
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

    } catch (e) {
      if (process.env.NODE_ENV !== "production") console.log("EERRRROOORRR!!!!", e);
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

    } catch (e) {
      if (process.env.NODE_ENV !== "production") console.log("EERRRROOORRR!!!!", e);
      next(e);
    }
  }
)

// request new email otp
router.post(
  "/otp/:user_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { params } = req;
      const { user_id } = params;

      const result = await usersService.regenerateLoginOTP(user_id as unknown as ObjectId);
      return res.status(201).json(SUCCESS(result));

    } catch (e) {
      if (process.env.NODE_ENV !== "production") console.log("ERRRORRRRRR!!!!", e);
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
    if (process.env.NODE_ENV !== "production") console.log("EERRRROOORRR!!!!", e);
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
  //validateModuleRequest,
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

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params } = req;
    const { id } = params;
    const result = await usersService.findByUserId(id);
    return res.status(200).json(SUCCESS(result));
  } catch (e) {
    if (process.env.NODE_ENV !== "production") console.log("EERRRROOORRR!!!!", e);
    next(e);
  }
})

router.post('/permissions', validateUserAccess, requirePermissions([BasePermissions.MANAGE_SYSTEM]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    await CreatePermissionSchema.validateAsync(body);
    const permission = await permissionsService.createCustomPermission(body);
    return res.status(201).json(SUCCESS(permission));
  } catch (e) {
    const error = extractError(e as unknown as genericErrors);
    return res.status(500).json(ERROR(error.toString()));
  }
})

router.get('/permissions', validateUserAccess, requirePermissions([BasePermissions.MANAGE_SYSTEM]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query } = req;
    const { permission } = query;
    let payload = {};
    if (permission === permissionType.BASE) {
      payload = { isBasePermission: true };
    }
    const roles = await permissionsService.getAllPermissions(payload);
    return res.status(200).json(SUCCESS(roles));
  } catch (e) {
    const error = extractError(e as unknown as genericErrors);
    return res.status(500).json(ERROR(error.toString()));
  }
});

router.put('/permissions/:id', validateUserAccess, requirePermissions([BasePermissions.MANAGE_SYSTEM]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body, params } = req;
    const { id } = params;
    await UpdatePermissionSchema.validateAsync(body);
    const permission = await permissionsService.updateCustomPermission(id, body);
    return res.status(201).json(SUCCESS(permission));
  } catch (e) {
    const error = extractError(e as unknown as genericErrors);
    return res.status(500).json(ERROR(error.toString()));
  }
})

router.delete('/permissions/:id', validateUserAccess, requirePermissions([BasePermissions.MANAGE_SYSTEM]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params } = req;
    const { id } = params;
    const permission = await permissionsService.deleteCustomPermission(id);
    return res.status(201).json(SUCCESS(permission));
  } catch (e) {
    const error = extractError(e as unknown as genericErrors);
    return res.status(500).json(ERROR(error.toString()));
  }
})

router.post('/roles', validateUserAccess, requirePermissions([BasePermissions.MANAGE_SYSTEM]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    await CreateRoleSchema.validateAsync(body);
    const role = await permissionsService.createRole(body);
    return res.status(201).json(SUCCESS(role));
  } catch (e) {
    const error = extractError(e as unknown as genericErrors);
    return res.status(500).json(ERROR(error.toString()));
  }
});


router.get('/roles', validateUserAccess, requirePermissions([BasePermissions.MANAGE_SYSTEM]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await permissionsService.getAllRoles({});
    return res.status(200).json(SUCCESS(roles));
  } catch (e) {
    const error = extractError(e as unknown as genericErrors);
    return res.status(500).json(ERROR(error.toString()));
  }
});

router.get('/roles/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params } = req;
    const { id } = params;
    const role = await permissionsService.getRolebyId(id as unknown as ObjectId);
    return res.status(201).json(SUCCESS(role));
  } catch (e) {
    const error = extractError(e as unknown as genericErrors);
    return res.status(500).json(ERROR(error.toString()));
  }
});

router.put('/roles/:id', validateUserAccess, requirePermissions([BasePermissions.MANAGE_SYSTEM]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body, params } = req;
    const { id } = params;
    await UpdateRoleSchema.validateAsync(body);
    const role = await permissionsService.updateRole(id, body);
    return res.status(201).json(SUCCESS(role));
  } catch (e) {
    const error = extractError(e as unknown as genericErrors);
    return res.status(500).json(ERROR(error.toString()));
  }
});

router.delete('/roles/:id', validateUserAccess, requirePermissions([BasePermissions.MANAGE_SYSTEM]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params } = req;
    const { id } = params;
    const role = await permissionsService.deleteRole(id);
    return res.status(201).json(SUCCESS(role));
  } catch (e) {
    const error = extractError(e as unknown as genericErrors);
    return res.status(500).json(ERROR(error.toString()));
  }
})

// PAYSTACK CUSTOMER

router.post('/paystack/customer/:id', validateModuleRequest, async (req, res) => {
  try {
    const { body, params } = req;
    const { id } = params;

    await CustomerCreateSchema.validateAsync(body)
    const customer = await paystackService.createCustomer({
      ...body,
      user_id: id
    });
    return res.status(201).json(SUCCESS(customer));
  } catch (e) {
    const error = extractError(e as unknown as genericErrors);
    return res.status(400).json(ERROR(error.toString()));
  }
});

router.get(
  "/billing-info",
  validateUserAccess,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const { _id } = user as any;
      console.log("ID", _id)
      const result = await paystackService.fetchBillingInfo(_id);
      return res.status(201).json(SUCCESS(result));
    } catch (e) {
      const error = extractError(e as unknown as genericErrors);
      return res.status(400).json(ERROR(error.toString()));
    }
  }
);

router.post(
  "/billing-info",
  validateUserAccess,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body, user } = req;
      const { _id } = user as any;

      await BillingInfoCreateSchema.validateAsync(body);
      
      const result = await paystackService.createBillingInfo(body, _id);
      return res.status(201).json(SUCCESS(result));
    } catch (e) {
      const error = extractError(e as unknown as genericErrors);
      return res.status(400).json(ERROR(error.toString()));
    }
  }
);

router.get('/card/', validateUserAccess, async (req, res) => {
  try {
    const { user } = req;
    const { _id: id } = user as users
    if (!id || typeof id !== 'string') {
      throw 'Invalid user or user ID';
    }
    const customer = await paystackService.getCustomerByUserId(id);
    return res.status(200).json(SUCCESS(customer));
  } catch (e) {
    const error = extractError(e as unknown as genericErrors);
    return res.status(400).json(ERROR(error.toString()));
  }
});

router.delete('/card/', validateUserAccess, checkSubscriptionExpiration, async (req, res) => {
  try {
    const { user } = req;
    const { _id: userId } = user as users
    const deleted = await paystackService.deleteCustomer(userId as unknown as any);
    return res.status(200).json(SUCCESS({
      message: 'Card deleted successfully',
      deleted
    }));
  } catch (e) {
    const error = extractError(e as unknown as genericErrors);
    return res.status(404).json(ERROR(error.toString()));
  }
});


export default router;