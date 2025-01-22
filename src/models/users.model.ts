import mongoose from "mongoose";
import { users } from "../types/users.type";
import uuid from "uuidv4";
import { UserStatus } from "../events/user.events.types";

// const uuid = require('uuid/v1');
const schema = new mongoose.Schema<users>({
    created: { type: Date, 'default': Date.now },
    googleId: { type: String },
    githubId: { type: String },
    linkedinId: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    otp: {
        otp_type: { type: String },
        active: { type: Boolean, 'default': false }
    },
    dp: { type: String },
    status: { type: String, enum: UserStatus, require },
    bio: { type: String },
    // @ts-ignore
    private_key: { type: String, 'default': uuid },
    active: { type: Boolean, 'default': false },
    profilePicture: { type: String, 'default': '' }
})

export const model = mongoose.model('users', schema);