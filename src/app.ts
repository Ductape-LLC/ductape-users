import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import * as dotEnv from 'dotenv';
import router from './commons/routesConfig';
import cors from 'cors';
import { UserError, sendErrorResponse } from './errors/errors';
import { urlRewrite } from './middleware/url-rewrite';
import session from 'express-session';

const app = express();
const port = process.env.PORT || 8002;

dotEnv.config();

app.use(urlRewrite);

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const allowedOrigins = ['http://localhost:3000', 'https://ductape-hwyp.vercel.app'];

const options: cors.CorsOptions = {
  // origin: allowedOrigins,
};

app.use(cors(options));

app.use(router);

app.get('/users/v1/status', (_req, res) => {
  res.send(`ductape-users-api is healthy`);
});

mongoose.connect(process.env.DB_HOST as string).catch((e) => {
  if (process.env.NODE_ENV !== 'production') console.log(e);
});

mongoose.connection.on('open', () => {
  if (process.env.NODE_ENV !== 'production') console.log('Mongoose Connection');
});

// app.use(
//     session({
//         secret: 'your_secret_key', // Replace with a strong secret key
//         resave: false,
//         saveUninitialized: true,
//         cookie: { secure: false }, // Set to true if using HTTPS
//     }),
// );

app.use(passport.initialize());
// app.use(passport.session());

app.listen(port, () => {
  if (process.env.NODE_ENV !== 'production') console.log(`ductape-users-api app is running on port ${port}.`);
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  sendErrorResponse(res, err as UserError);
});
