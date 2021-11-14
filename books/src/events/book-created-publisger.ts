import {
  publisher,
  Subjects,
  bookCreatedEvents,
} from '@aroona/commonhandeller';

export class BookCreatedPublisher extends publisher<bookCreatedEvents> {
  readonly subject = Subjects.BookCreated;
}
