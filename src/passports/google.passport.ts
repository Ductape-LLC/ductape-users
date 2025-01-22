import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { model as UserModel } from '../models/users.model';
import dotenv from 'dotenv';
import { users } from '../types/users.type';
import UsersService from '../services/users.service';

dotenv.config();

const usersService = new UsersService();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${process.env.USER_SERVICE}/users/v1/auth/google/callback`,
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done) => {
      const { id, name, emails } = profile;
      const email = emails?.[0].value;
      const user = await UserModel.findOne({ $or: [{ googleId: id }, { email }] });

      if (user) {
        console.log("USER :::", user)
        await UserModel.findByIdAndUpdate(
          user._id,
          { $set: { googleId: id } },
          { new: true, upsert: true },
        );
        return done(null, user);
      } else {
        const body = {
          googleId: id,
          firstname: name?.givenName || '',
          lastname: name?.familyName || '',
          email,
          password: `${email}${id}`
        };
        const user = await usersService.createUserAccount(body);
        return done(null, user);
      }
    },
  ),
);
