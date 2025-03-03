import { Request, Response, NextFunction } from 'express';
import { IPermission, IRole } from '../types/permission.type';
import ERROR from "../commons/errorResponse";
import { model as User } from '../models/users.model';

export const requirePermissions = (requiredPermissions: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json(ERROR('Validation Failed'));
            }

            const user = await User.findById(req.user._id).populate({
                path: 'roles',
                populate: {
                    path: 'permissions'
                }
            });

            if (!user) {
                return res.status(401).json(ERROR('User not found'));
            }

            const userPermissions = user.roles.flatMap((role: any)=> 
                role.permissions.map((permission: Partial<IPermission>) => permission.name)
            );

            const hasPermission = requiredPermissions.every(permission => 
                userPermissions.includes(permission)
            );

            if (!hasPermission) {
                return res.status(403).json(ERROR('Insufficient permissions'));
            }

            next();
        } catch (error) {
            res.status(500).json(ERROR(error));
        }
    };
};