import express, { Response, Request } from 'express';
import { Book } from '../models/book';
import { validatorChecker, create_book_validator } from '../service/validator';
import {
  authRequired,
  GeneralError,
  notAuthorizedErorr,
} from '@aroona/commonhandeller';

const route = express.Router();

route.delete(
  '/api/books/:id',
  authRequired,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const deletedBook = await Book.findById(id);

    if (!deletedBook) {
      throw new GeneralError('there is not any book with this ID ', 404);
    }

    if (deletedBook.userId !== req.auth!.id) {
      throw new notAuthorizedErorr();
    }
    await Book.findByIdAndDelete(id);

    res.status(200).send('Book was removed correctly');
  }
);

export { route as deleteRouter };
