import express, { Response, Request } from 'express';
import { Book } from '../models/book';
import { validatorChecker, create_book_validator } from '../service/validator';
import { authRequired, GeneralError } from '@aroona/commonhandeller';

const route = express.Router();

route.get('/api/books/', async (req: Request, res: Response) => {
  const Records = await Book.find({});
  if (Records.length === 0) {
    return res.status(200).send('there is not any Records');
  }
  res.status(200).send(Records);
});

export { route as indexRouter };
