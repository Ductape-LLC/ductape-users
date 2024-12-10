import { NextFunction, Request, response, Response, Router } from "express";
import { AuthRepo } from "../repo/auth.repo";
import ERROR from "../commons/errorResponse";
import { stripAuth } from "../utils/users.utils.string";
import { UsersRepo } from "../repo/users.repo";
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | any;
    }
  }
}

export const validateUserAccess = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log("TRY");
    try {

        const { body, query, params } = req;
        const auth_token = req.headers["x-access-token"] as string || req.headers["authorization"] as string;

        if(!auth_token) return res.status(401).json(ERROR("Missing Auth Token"));

        const token = stripAuth(auth_token);
        let { public_key, user_id } = body;

        if(!user_id) user_id = params.user_id || query.user_id;
        if(!public_key) public_key = params.public_key || query.public_key;

        console.log("TRUSS",public_key, user_id, token)

        const data = await UsersRepo.fetchByIdReturnPrivateKey(user_id);
        const { public_key: p_key, private_key } = data;
        if (p_key !== public_key) throw 'Invalid key access';

        const result = await AuthRepo.validateUserAuthJWT(token, private_key as string);

        if(result){
            
            req.user = result;
            next();
        } else {
            return res.status(401).json(ERROR("Validation Failed"));
        }
    } catch (e) {
        console.log("ERRRRRRROOOOOOOORRR!", e);
        return res.status(401).json(ERROR(e));
    }

}