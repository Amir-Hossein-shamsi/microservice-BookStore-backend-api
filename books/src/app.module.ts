import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  GeneralError,
  authorizationUser,
} from '@aroona/commonhandeller';
import { createRouter } from './routes/create';
import { indexRouter } from './routes';
import { deleteRouter } from './routes/delete';
import { updateRouter } from './routes/update';
import { showRouter } from './routes/show';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(authorizationUser);
app.use(createRouter);
app.use(indexRouter);
app.use(showRouter);
app.use(updateRouter);
app.use(deleteRouter);

app.all('*', async (req, res) => {
  throw new GeneralError('this page not founded', 404);
});
app.use(errorHandler);
export { app };
