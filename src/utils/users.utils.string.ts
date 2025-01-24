import SHA256 from "crypto-js/sha256";
import { genericErrors } from "../types/users.type";
import bcrypt from "bcrypt";

export const capitalize = (s: string): string => {
    return `${s[0].toUpperCase()}${s.slice(1)}`
}

export const sha256 = (s: string) => {
    return (SHA256(s)).toString();
}

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}

export const extractError = (e: genericErrors): string => {

    const { code, _original, details } = e;

    console.log("ORIGINAL", _original);
    if (code === 11000) return "Email in use";

    if (_original) return removeRegEx(/"/g, details[0].message);

    return e.toString();
}

export const removeRegEx = (exp: RegExp, str: string): string => {
    return str.replace(exp, '');
}

export const generateSixDigitToken = (): string => {
    const min = 100000;
    const max = 900000;

    return String(Math.floor(Math.random() * min) + max);
}

export const generateConfirmationExpiry = (): Date => {
    const dt = new Date();
    dt.setHours(dt.getHours() + 2);

    return dt;
}

export const generateOTPExpiry = (): Date => {
    const dt = new Date();
    dt.setMinutes(dt.getMinutes() + 5);

    return dt;
}

export const stripAuth = (token: string) => {
    if (token.startsWith("Bearer ")) token = token.slice(7, token.length);

    return token;
};