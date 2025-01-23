import mongoose from "mongoose";


export interface AuthKeyLoginPayload {
    user_id: string;
    private_key: string;
    workspace_id: string;
}
export interface users {
    _id?: mongoose.Schema.Types.ObjectId;
    created: Date;
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    dp?: string;
    bio?: string;
    otp?: {
        otp_type: otp_types,
        active: boolean
    },
    private_key?: string;
    public_key?: string;
    auth_token?: string;
    active: boolean;
    workspaces?: Array<any>;
    permissions?: Array<string>;
    status?: string;
    profilePicture?: string;
    googleId?: string;
    githubId?: string;
    linkedinId: string;
    oauth_service?: string;
};

export interface genericErrors { code?: number, _original: unknown, details: [{ message: string }] }

export enum otp_types {
    EMAIL = "email",
    GOOGLE_AUTH = "google"
}

export enum OauthServices {
    GOOGLE = "google",
    GITHUB = "github",
    LINKEDIN = "linkedIn"
}

export interface otp_login {
    user_id: string;
    token: string;
}

export interface change_password {
    email?: string;
    password?: string;
    token?: string;
    oldPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
}