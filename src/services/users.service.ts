import EVENTBROKER from '../events';
import { ConfirmRepo, IConfirmRepo } from '../repo/confirm.repo';
import { AuthRepo, IAuthRepo } from '../repo/auth.repo';
import { UsersRepo, IUsersRepo } from '../repo/users.repo';
import { AuthKeyLoginPayload, otp_types, users } from '../types/users.type';
import { EventType, UserStatus } from '../events/user.events.types';
import { ObjectId } from 'mongoose';
import { confirmUser } from '../types/confirm.type';
import { ForgotRepo, IForgotRepo } from '../repo/forgot.repo';
import { IOTPRepo, OTPRepo } from '../repo/otp.repo';
import sha256 from 'crypto-js/sha256';
import { handleError, NotFoundError } from '../errors/errors';

export interface IUsersService {
  createUserAccount(payload: users): Promise<users>;
  loginUserAccount(payload: Partial<users>, query: { private_key?: boolean }): Promise<users>;
  confirmUserAccount(token: string, confirm_id: ObjectId): Promise<boolean>;
  validatePublicKeyJWT(token: string, user_id: ObjectId, public_key: string): Promise<unknown>;
}

export default class UsersService implements IUsersService {
  UserRepo: IUsersRepo;
  AuthRepo: IAuthRepo;
  ConfirmRepo: IConfirmRepo;
  ForgotRepo: IForgotRepo;
  OTPRepo: IOTPRepo;

  constructor() {
    this.UserRepo = UsersRepo;
    this.AuthRepo = AuthRepo;
    this.ConfirmRepo = ConfirmRepo;
    this.ForgotRepo = ForgotRepo;
    this.OTPRepo = OTPRepo;
  }

  async createUserAccount(payload: Partial<users>): Promise<users> {
    let user = await this.UserRepo.getTemporaryUser(payload.email as string)
    if (user && user.status === UserStatus.TEMPORARY){
      user = await this.UserRepo.updateTemporaryUser(user._id, payload)
    } else {
      user = await this.UserRepo.create(payload as users);
    }
    const confirm = await this.ConfirmRepo.create(user);
    const { _id: confirm_id, token } = confirm;
    const auth = `Bearer ${await this.AuthRepo.generateModuleAuthJWT('2m')}`;
    EVENTBROKER({ event: EventType.CONFIRM_EMAIL, data: { user, token, confirm_id, auth } });
    return user
  }

  async updateUserAccount(payload: users, id: string): Promise<users> {
    let user = await this.findByUserId(id)
    if (!user) throw new NotFoundError('user')
      
    const result = await this.UserRepo.updateOne(id, payload);
    user = await this.findByUserId(id)
    return user
  }

  async createTemporary(payload: users): Promise<users> {
    const user = await this.UserRepo.createTemporaryUser(payload);
    return user;
  }

  async loginUserAccount(payload: Partial<users>, query: { private_key?: boolean }): Promise<users> {
    try {
      const userData = await this.UserRepo.login(payload);

      const { private_key, otp } = userData;

      if (!query.private_key) {
        delete userData.private_key;
      }

      let otp_type, active;

      if (otp) {
        otp_type = otp.otp_type;
        active = otp.active;
      }

      if (!active) {
        const auth_token = await this.AuthRepo.generateUserAuthJWT(userData, private_key as string, '100y');
        return { ...userData, auth_token };
      } else {
        if (otp_type === otp_types.EMAIL) {
          const auth = `Bearer ${await this.AuthRepo.generateModuleAuthJWT('100y')}`;
          const otp = await this.OTPRepo.create(userData);
          const { _id: otp_id, token } = otp;
          EVENTBROKER({ event: EventType.SEND_OTP, data: { user: userData, token, otp_id, auth } });
        }
        return { ...userData };
      }
    } catch (e) {
      console.log(e);
      throw handleError(e);
    }
  }

  async loginUserAccountAuthKey(payload: AuthKeyLoginPayload): Promise<users> {
    try {
      const user = await this.UserRepo.fetchByPrivateKey(payload);

      const auth_token = await this.AuthRepo.generateUserAuthJWT(user, payload.private_key as string, '100y');

      return { ...user, auth_token };
    } catch (e) {
      throw handleError(e);
    }
  }

  async otpLogin(token: string, user_id: ObjectId): Promise<users> {
    try {
      const user = await this.UserRepo.fetchByIdReturnPrivateKey(user_id);

      const { otp, private_key } = user;

      if (otp) {
        const { otp_type, active } = otp;

        let pass = false;
        if (token === '123456' && process.env.NODE_ENV !== 'production') pass = true;

        if (otp_type === otp_types.EMAIL) {
          const valid = await this.OTPRepo.fetchByUser({ token, user_id });

          if (!valid && !pass) throw 'Invalid OTP';
          const { expiry, _id: otp_id, status } = valid;

          if ((new Date(expiry) < new Date() || status) && !pass) throw 'OTP has expired';

          // if(process.env.NODE_ENV !== "production") console.log("PRIVATES!!!!",private_key)

          const auth_token = await this.AuthRepo.generateUserAuthJWT(user, private_key as string, '100y');

          await this.OTPRepo.updateOne(otp_id, { status: true });
          delete user.private_key;
          return { ...user, auth_token };
        } else {
          if (token !== '098302') throw 'Invalid OTP'; // TODO: Implement Google Authenticator

          const auth_token = await this.AuthRepo.generateUserAuthJWT(user, private_key as string, '100y');
          delete user.private_key;
          return { ...user, auth_token };
        }
      } else {
        throw '2FA not enabled';
      }
    } catch (e) {
      throw handleError(e);
    }
  }

  async regenerateLoginOTP(user_id: ObjectId): Promise<boolean> {
    try {
      const user = await this.UserRepo.fetchById(user_id);

      if (!user) throw 'User not found';

      const auth = `Bearer ${await this.AuthRepo.generateModuleAuthJWT('2m')}`;
      const otp = await this.OTPRepo.create(user);
      const { _id: otp_id, token } = otp;
      EVENTBROKER({ event: EventType.SEND_OTP, data: { user, token, otp_id, auth } });

      return true;
    } catch (e) {
      throw handleError(e);
    }
  }

  async confirmUserAccount(token: string, confirm_id: ObjectId): Promise<boolean> {
    try {
      const confirm = await this.ConfirmRepo.fetch({ token, _id: confirm_id });

      let pass = false;
      if (token === '123456' && process.env.NODE_ENV !== 'production') pass = true;

      if (!confirm && !pass) throw 'Invalid credentials';

      if (confirm) {
        const { status, expiry, user_id } = confirm;

        if (status) throw 'Confirm link already used';
        if (new Date(expiry).getTime() < new Date().getTime()) throw 'Confirm link has expired';

        const user = await this.UserRepo.fetchById(user_id);
        const { active } = user;

        if (active) throw 'Account already active';

        await this.UserRepo.updateOne(user_id, { active: true });
      } else {
        // temp workaround for tokens
        await this.UserRepo.updateOne(confirm_id, { active: true });
      }

      return true;
    } catch (e) {
      console.log(e);
      throw handleError(e);
    }
  }

  async generateResetUserPassword(email: string): Promise<boolean> {
    try {
      const user = await this.UserRepo.fetchByEmail(email);

      if (!user) throw 'Email does not exist';

      const forgot = await this.ForgotRepo.create(user);

      const { token, _id } = forgot;
      const auth = `Bearer ${await this.AuthRepo.generateModuleAuthJWT('100y')}`;

      if (process.env.NODE_ENV !== 'production') console.log('event broker init');
      EVENTBROKER({ event: EventType.FORGOT_EMAIL, data: { user, token, forgot_id: _id, auth } });

      return true;
    } catch (e) {
      throw handleError(e);
    }
  }

  async changePassword(token: string, email: string, password: string): Promise<boolean> {
    try {
      const user = await this.UserRepo.fetchByEmail(email);

      if (!user) throw 'Email does not exist';

      const { _id: user_id } = user;

      let pass = false;
      if (process.env.NODE_ENV !== 'production') pass = true;

      if (!pass) {
        const forgot = await this.ForgotRepo.fetchByUser({ token, user_id });

        if (!forgot) throw 'Invalid Token';

        const { _id: forgot_id, status } = forgot;

        if (status) throw 'Token expired';
        await this.ForgotRepo.updateOne(forgot_id, { status: true });
      }

      await this.UserRepo.updateOne(user_id, { password: sha256(password).toString() });
      return true;
    } catch (e) {
      throw handleError(e);
    }
  }

  async changeUserPassword(email: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.UserRepo.fetchByEmail(email);

    if (!user) throw 'Email does not exist';

    const isPasswordValid = sha256(oldPassword).toString() === user.password;
    if (!isPasswordValid) throw 'Current password is incorrect'

    await this.UserRepo.updateOne(user._id, { password: sha256(newPassword).toString() });

    return true;
  }

  async validatePublicKeyJWT(token: string, user_id: ObjectId, public_key: string): Promise<unknown> {
    try {
      const data = await this.UserRepo.fetchByIdReturnPrivateKey(user_id);
      console.log(data);
      const { public_key: p_key, private_key } = data;
      if (p_key !== public_key) throw 'Invalid key access';

      return await this.AuthRepo.validateUserAuthJWT(token, private_key as string);
    } catch (e) {
      console.log(e)
      throw handleError(e);
    }
  }

  async findByEmail(email: string): Promise<users> {
    return await this.UserRepo.fetchByEmail(email);
  }

  async findByUserId(id: string): Promise<users> {
    return await this.UserRepo.fetchById(id);
  }
}
