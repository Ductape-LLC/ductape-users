import mongoose from "mongoose";
import { users } from "../types/users.type";
import uuid from "uuidv4";

// const uuid = require('uuid/v1');
const schema = new mongoose.Schema<users>({
    created: {type: Date, 'default': Date.now},
    firstname: {type: String},
    lastname: {type: String},
    email: {type: String, unique: true},
    password: {type: String},
    otp: {
        otp_type: {type: String},
        active: {type: Boolean, 'default': false}
    },
    dp: {type: String},
    bio: {type: String},
    // @ts-ignore
    private_key: {type: String, 'default': uuid},
    active: {type: Boolean, 'default': false}
})

export const model = mongoose.model('users', schema);