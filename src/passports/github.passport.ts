import passport from 'passport';
import GitHubStrategy, { Profile } from 'passport-github';
import { model as UserModel } from '../models/users.model';
import dotenv from 'dotenv';
import { users } from '../types/users.type';
import UsersService from '../services/users.service';

dotenv.config();

const usersService = new UsersService();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GIT_CLIENT_ID as string,
      clientSecret: process.env.GIT_CLIENT_SECRET as string,
      callbackURL: `${process.env.USER_SERVICE}/users/v1/auth/github/callback`,
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done) => {
      const { id, emails, username } = profile;
      const email = emails?.[0].value;
      const user = await UserModel.findOne({ $or: [{ githubId: id }, { email }] });

      if (user) {
        await UserModel.findByIdAndUpdate(
          user._id,
          { $set: { githubId: id } },
          { new: true, upsert: true },
        );
        return done(null, user);
      } else {
        const body = {
          githubId: id,
          firstname: username || '',
          lastname: '',
          email: email,
          password: `${email}${id}`,
        };
        const user = await usersService.createUserAccount(body);
        return done(null, user);
      }
    },
  ),
);
