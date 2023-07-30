import { Request } from 'express';
import passport from 'passport';
// import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth2";
import * as dotEnv from 'dotenv'

dotEnv.config();

const GoogleStrategy = require ("passport-google-oauth2").Strategy 

passport.serializeUser((user:any,done)=>{
    done(null,user)
})
passport.deserializeUser((user:any,done)=>{
    done(null,user)
})

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    PassReqToCallback: true
}, (request: Request, accessToken: string, refreshToken: string, profile: any, done: any) => {
    console.log(profile);
    return done(null,profile)
}
))

