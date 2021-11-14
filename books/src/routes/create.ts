import express, { Response, Request } from 'express';
import { Book } from '../models/book';
import { validatorChecker, create_book_validator } from '../service/validator';
import { authRequired, GeneralError } from '@aroona/commonhandeller';
import { BookCreatedPublisher } from '../events/book-created-publisger';
import { nastsWrapper } from '../natswrapper';

const route = express.Router();

route.post(
  '/api/books',
  authRequired,
  create_book_validator,
  validatorChecker,
  async (req: Request, res: Response) => {
    const { title, price, description, author, publication_date, rank } =
      req.body;

    const createRecord = Book.build({
      title,
      price,
      description,
      author,
      publication_date,
      rank,
      userId: req.auth!.id,
    });
    await createRecord.save();
    //console.log(`A new Record was added by ${req.auth!.email}`);
    await new BookCreatedPublisher(nastsWrapper.client).publish({
      id: createRecord.id,
      title_book: createRecord.title,
      price: createRecord.price,
      author: createRecord.author,
      userId: createRecord.userId,
    });
    res.status(201).send(createRecord);
  }
);

export { route as createRouter };
