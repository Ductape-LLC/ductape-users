import express from 'express';
import mongoose from 'mongoose';
import * as dotEnv from 'dotenv';
import router from './commons/routesConfig';
import cors from 'cors';
import passport from 'passport'
import session from "express-session";

require('./middleware/passport-setup.middleware')

const app = express();
const port = process.env.PORT || 8002;

// require('./passport-setup')

dotEnv.config();
// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const secretKey = process.env.RANDOM_KEY || 'defaultSecretKey';

app.use(
  session({
    secret: secretKey, // Replace this with a strong secret
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize())
app.use(passport.session())


const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));

app.use(router);
mongoose.connect(process.env.DB_HOST as string).catch((e) => {
  console.log(e);
});

mongoose.connection.on('open', () => {
  console.log('Mongoose Connection');
});

// app.get(
//   "/google",
//   passport.authenticate('google', {scope: ['profile', 'email']})  
// )

app.listen(port, () => {
  console.log(`ductape-users-api application is running on port ${port}.`);
});

