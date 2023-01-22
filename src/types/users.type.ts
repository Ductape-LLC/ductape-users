import mongoose from "mongoose";

export interface users {
    _id?: mongoose.Schema.Types.ObjectId;
    created: Date;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    dp?: string;
    bio?: string;
    private_key?: string;
    public_key?: string;
    auth_token?: string;
    active: boolean;
    workspaces?: Array<any>;
    permissions?: Array<string>;
};

export interface genericErrors { code?: number, _original: unknown, details: [{ message: string }] }