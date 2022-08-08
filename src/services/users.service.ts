import EVENTBROKER from "../events";
import { ConfirmRepo, IConfirmRepo } from "../repo/confirm.repo";
import { AuthRepo, IAuthRepo } from "../repo/auth.repo";
import { UsersRepo, IUsersRepo } from "../repo/users.repo";
import { users } from "../types/users.type";
import { EventType } from "../events/user.events.types";
import { ObjectId } from "mongoose";
import { confirmUser } from "../types/confirm.type";
import { ForgotRepo, IForgotRepo } from "../repo/forgot.repo";

export interface IUsersService {
    createUserAccount(payload: users): Promise<users>;
    loginUserAccount(payload: Partial<users>): Promise<users>;
    confirmUserAccount(token: string, confirm_id: ObjectId): Promise<boolean>;
    validatePublicKeyJWT(token: string, user_id: ObjectId, public_key: string): Promise<unknown>;
}

export default class UsersService implements IUsersService {
    UserRepo: IUsersRepo;
    AuthRepo: IAuthRepo;
    ConfirmRepo: IConfirmRepo;
    ForgotRepo: IForgotRepo;

    constructor() {
        this.UserRepo = UsersRepo;
        this.AuthRepo = AuthRepo;
        this.ConfirmRepo = ConfirmRepo;
        this.ForgotRepo = ForgotRepo;
    }

    async createUserAccount(payload: users): Promise<users>{
        const user = await this.UserRepo.create(payload);

        const confirm = await this.ConfirmRepo.create(user);
        const {_id: confirm_id, token} = confirm;
        const auth = `Bearer ${await this.AuthRepo.generateModuleAuthJWT('2m')}`

        EVENTBROKER({event: EventType.CONFIRM_EMAIL, data: {user, token, confirm_id, auth} })
        return user;
    }

   async loginUserAccount(payload: Partial<users>): Promise<users> {
       const userData = await this.UserRepo.login(payload);

       const {private_key} = userData;
       delete userData.private_key;
       const auth_token = await this.AuthRepo.generateUserAuthJWT(userData, private_key as string, '7h');

       return {...userData, auth_token }
   }

   async confirmUserAccount(token: string, confirm_id: ObjectId): Promise<boolean> {
        try {
            const confirm = await this.ConfirmRepo.fetch({token, _id: confirm_id});

            if(!confirm) throw 'Invalid credentials'

            const { status, expiry, user_id } = confirm;

            if(status) throw 'Confirm link already used';
            if(new Date(expiry).getTime()< new Date().getTime()) throw 'Confirm link has expired';

            const user = await this.UserRepo.fetchById(user_id);
            const { active } = user;

            if(active) throw 'Account already active';

            await this.UserRepo.updateOne(user_id, {active: true});

            return true;
        } catch(e) {
            throw e;
        }
   }

   async generateResetUserPassword(email: string): Promise<boolean> {
        try{
            const user = await this.UserRepo.fetchByEmail(email);

            if(!user) throw 'Email does not exist';

            const forgot = await this.ForgotRepo.create(user);

            const {token, _id} = forgot;
            const auth = `Bearer ${await this.AuthRepo.generateModuleAuthJWT('2m')}`

            EVENTBROKER({event: EventType.FORGOT_EMAIL, data: {user, token, forgot_id: _id, auth}});

            return true;
        } catch(e) {
            throw e;
        }
    }

    async validatePublicKeyJWT(token: string, user_id: ObjectId, public_key: string): Promise<unknown> {
        try{
            const data = await this.UserRepo.fetchByIdReturnPrivateKey(user_id);
            const {public_key: p_key, private_key} = data;
            if(p_key !== public_key) throw "Invalid key access";

            console.log("TOKEN!", token);
            console.log("PRIVATE KEY!!!",private_key);
            return await this.AuthRepo.validateUserAuthJWT(token, private_key as string);
        } catch (e) {
            throw e;
        }
    }

    async findByEmail(email: string): Promise<users> {
        return await this.UserRepo.fetchByEmail(email); 
    }
}