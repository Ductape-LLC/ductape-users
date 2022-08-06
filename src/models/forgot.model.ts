import mongoose from "mongoose";
import { confirmUser as forgotUser } from "../types/confirm.type";
import { generateConfirmationExpiry, generateSixDigitToken } from "../utils/users.utils.string";

// const uuid = require('uuid/v1');
const schema = new mongoose.Schema<forgotUser>({
    created: {type: Date, 'default': Date.now},
    token: {type: String, 'default': generateSixDigitToken},
    status: {type: Boolean, 'default': false},
    expiry: {type: Date, 'default': generateConfirmationExpiry},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "Users"}
})

export const model = mongoose.model('forgot_users', schema);