import passport from 'passport';
import { model as UserModel } from '../models/users.model';
import dotenv from 'dotenv';
import { users } from '../types/users.type';
import UsersService from '../services/users.service';
// import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

dotenv.config();

const usersService = new UsersService();

passport.use(
    new LinkedInStrategy(
        {
            clientID: process.env.LINKEDIN_CLIENT_ID as string,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
            callbackURL: `${process.env.USER_SERVICE}/users/v1/auth/linkedin/callback`,
            scope: ['openid', 'profile', 'email'], 
        },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
            const { id, email, givenName, familyName } = profile;

            try {
                const user = await UserModel.findOne({
                    $or: [{ linkedinId: id }, { email }]
                });

                if (user) {
                    await UserModel.findByIdAndUpdate(
                        user._id,
                        { $set: { linkedinId: id } },
                        { new: true, upsert: true },
                    );
                    return done(null, user);
                } else {
                    const body = {
                        linkedinId: id,
                        firstname: givenName || '',
                        lastname: familyName || '',
                        email,
                        password: `${email}${id}`,
                    };
                    const user = await usersService.createUserAccount(body);
                    return done(null, user);
                }
            } catch (error) {
                console.error(error);
                return done(error, null);
            }
        },
    ),
);