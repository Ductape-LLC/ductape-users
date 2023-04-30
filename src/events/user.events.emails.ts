import { SEND_CONFIRM_EMAIL, SEND_FORGOT_EMAIL, SEND_OTP_EMAIL } from "../constants/user.constants.urls";
import client from "../clients/axios";
import { confirmUserEmailEvent, forgotUserEmailEvent, sendOTPEmailEvent } from "../types/confirm.type";
export const emailClient = (auth: string)=>{
    return client(process.env.EMAIL_SERVICE as string, auth, "application/json")
}

export const sendConfirmationEmail = async (payload: confirmUserEmailEvent) => {
    try{
        const {user, confirm_id, token, auth} = payload;
        const {firstname, lastname, email, public_key} = user;

        return await emailClient(auth).post(SEND_CONFIRM_EMAIL, {firstname, lastname, email, confirm_id, token});
    } catch(e) {
        if(process.env.NODE_ENV !== "production") console.log(e);
    }
}

export const sendForgotEmail = async (payload: forgotUserEmailEvent) => {
    try {
        const {user, forgot_id, token, auth} = payload;
        const {firstname, lastname, email, public_key} = user;

        return await emailClient(auth).post(SEND_FORGOT_EMAIL, {firstname, lastname, email, forgot_id, token});
    } catch(e) {
        if(process.env.NODE_ENV !== "production") console.log(e);
    }
}

export const sendOTPEmail = async (payload: sendOTPEmailEvent) => {
    try {

        const {user, otp_id, token, auth} = payload;

        const {firstname, lastname,email, public_key} = user;

        return await emailClient(auth).post(SEND_OTP_EMAIL, {firstname, lastname, email, otp_id, token});

    } catch(e) {
        if(process.env.NODE_ENV !== "production") console.log(e);
    }
}