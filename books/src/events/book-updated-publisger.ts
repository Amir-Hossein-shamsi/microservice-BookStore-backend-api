import {
  Subjects,
  BookUpdatedEvents,
  publisher,
} from '@aroona/commonhandeller';

export class BookUpdatedPublisher extends publisher<BookUpdatedEvents> {
  readonly subject = Subjects.BookUpdated;
}
