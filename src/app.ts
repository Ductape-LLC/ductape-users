import express from 'express';
import mongoose from 'mongoose';
import * as dotEnv from 'dotenv';
import router from './commons/routesConfig';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8002;

dotEnv.config();
// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ['http://localhost:3000','https://ductape-frontend-5jdc.vercel.app','https://ductape-frontend.vercel.app',];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));

app.use(router);
mongoose.connect(process.env.DB_HOST as string).catch((e) => {
  if(process.env.NODE_ENV !== "production") console.log(e);
});

mongoose.connection.on('open', () => {
  if(process.env.NODE_ENV !== "production") console.log('Mongoose Connection');
});

app.listen(port, () => {
  if(process.env.NODE_ENV !== "production") console.log(`ductape-users-api app is running on port ${port}.`);
});