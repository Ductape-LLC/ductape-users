import mongoose from "mongoose";

export enum permissionType {
    BASE = 'base',
    CUSTOM = 'custom'
}

export enum BasePermissions {

    CREATE_USER = 'create_user',
    READ_USER = 'read_user',
    UPDATE_USER = 'update_user',
    DELETE_USER = 'delete_user',
    
    CREATE_ROLE = 'create_role',
    READ_ROLE = 'read_role',
    UPDATE_ROLE = 'update_role',
    DELETE_ROLE = 'delete_role',
    
    CREATE_PERMISSION = 'create_permission',
    READ_PERMISSION = 'read_permission',
    UPDATE_PERMISSION = 'update_permission',
    DELETE_PERMISSION = 'delete_permission',

    CREATE_SUBSCRIPTION = 'create_subscription',
    READ_SUBSCRIPTION = 'read_subscription',
    UPDATE_SUBSCRIPTION = 'update_subscription',
    DELETE_SUBSCRIPTION = 'delete_subscription',
    
    MANAGE_SYSTEM = 'manage_system',
}

export interface IRole {
    _id?: mongoose.Schema.Types.ObjectId;
    name: string;
    description?: string;
    permissions: mongoose.Schema.Types.ObjectId[] | IPermission[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IPermission {
    _id?: string;
    name: string;
    description: string;
    category: string;
    isBasePermission: boolean;
    createdAt: Date;
    updatedAt: Date;
}