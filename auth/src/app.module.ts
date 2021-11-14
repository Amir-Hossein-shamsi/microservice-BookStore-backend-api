import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { authRouter } from './routes/auth-routers';
import { errorHandler } from '@aroona/commonhandeller';

const app = express();
app.set('trust proxy', true);
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(json());
app.use('/api/users', authRouter);

app.use(errorHandler);
export { app };
