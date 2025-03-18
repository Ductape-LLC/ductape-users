import { ObjectId } from "mongoose";


export enum AccessTypes {
    OWNER = "owner",
    ADMIN = "admin",
    COLLABORATOR = "collaborator"
}

export enum InviteTypes {
    MULTIPLE = "multiple",
    SINGLE = "single"
}

export enum AccessInviteActionTypes {
    ACCEPT = "accept",
    REJECT = "reject"
}

export enum UserStatus {
    ACTIVE = "active",
    TEMPORARY = "temporary",
};

export interface access {
    _id?: ObjectId,
    workspace_id: ObjectId,
    user_id?: ObjectId,
    access_level: AccessTypes,
    accepted: Boolean,
    default: Boolean,
    public_key?: string,
    email?: string,
    emails?: string,
    name?: string,
    type?: string,
    date_joined?: Date
}