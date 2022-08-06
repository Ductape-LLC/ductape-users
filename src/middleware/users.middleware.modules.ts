import { NextFunction, Request, response, Response, Router } from "express";
import { AuthRepo } from "../repo/auth.repo";
import { stripAuth } from "../utils/users.utils.string";
import ERROR from "../commons/errorResponse";

export const validateModuleRequest = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    try{
        const auth = req.headers["x-access-token"] as string || req.headers["authorization"] as string;

        if (!auth)  return res.status(401).json(ERROR( "Auth token is not supplied"));

        const token = stripAuth(auth);
        const valid = await AuthRepo.validateModuleAuthJWT(token);

        if(valid){
            // @ts-ignore
            req.decoded

            next();   
        } else {
            return res.status(401).json(ERROR("Validation Failed"));
        }

    } catch(e) {
        console.log(e);
        return res.status(401).json(ERROR(e));
    }

}