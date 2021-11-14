import express, { Response, Request } from 'express';
import { Book } from '../models/book';
import { validatorChecker, create_book_validator } from '../service/validator';
import { authRequired, GeneralError } from '@aroona/commonhandeller';

const route = express.Router();

route.get('/api/books/:id', async (req: Request, res: Response) => {
  const findingRecord = await Book.findById(req.params.id);
  if (!findingRecord) {
    throw new GeneralError('there is  not any record with this ID', 404);
  }
  res.status(200).send({ findingRecord });
});

export { route as showRouter };
