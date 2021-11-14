import express, { Response, Request } from 'express';
import { Book } from '../models/book';
import { validatorChecker, update_book_validator } from '../service/validator';
import {
  authRequired,
  GeneralError,
  notAuthorizedErorr,
} from '@aroona/commonhandeller';
import { BookUpdatedPublisher } from '../events/book-updated-publisger';
import { nastsWrapper } from '../natswrapper';

const route = express.Router();

route.patch(
  '/api/books/:id',
  authRequired,
  update_book_validator,
  validatorChecker,
  async (req: Request, res: Response) => {
    const updatingBook = await Book.findById(req.params.id);
    if (!updatingBook) {
      throw new GeneralError('this book is not exist plz try again', 404);
    }
    if (updatingBook.userId !== req.auth!.id) {
      throw new notAuthorizedErorr();
    }
    const { title, price, author, description, rank, publication_date } =
      req.body;
    updatingBook.set({
      title,
      price,
      author,
      description,
      rank,
      publication_date,
    });

    await updatingBook.save();
    await new BookUpdatedPublisher(nastsWrapper.client).publish({
      id: updatingBook.id,
      title_book: updatingBook.title,
      price: updatingBook.price,
      author: updatingBook.author,
      userId: updatingBook.userId,
    });
    res.status(200).send(updatingBook);
  }
);

export { route as updateRouter };
