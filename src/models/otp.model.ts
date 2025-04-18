import mongoose from "mongoose";
import { confirmUser as otpUser } from "../types/confirm.type";
import { generateOTPExpiry, generateSixDigitToken } from "../utils/users.utils.string";

// const uuid = require('uuid/v1');
const schema = new mongoose.Schema<otpUser>({
    created: {type: Date, 'default': Date.now},
    token: {type: String, 'default': generateSixDigitToken},
    status: {type: Boolean, 'default': false},
    expiry: {type: Date, 'default': generateOTPExpiry},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "Users"}
})

export const model = mongoose.model('otps', schema);