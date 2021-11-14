import mongoose from 'mongoose';
import { transform } from 'typescript';

interface BookAttr {
  title: string;
  price: number;
  description: string;
  author: string;
  publication_date: Date;
  rank: number;
  userId: string;
}
interface BookDoc extends mongoose.Document {
  title: string;
  price: number;
  description: string;
  author: string;
  publication_date: Date;
  rank: number;
  userId: string;
}

interface BookModel extends mongoose.Model<BookDoc> {
  build(attrs: BookAttr): BookDoc;
}

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },

    price: {
      type: Number,
      require: true,
    },
    description: {
      type: String,
      default:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      require: true,
    },
    author: {
      type: String,
      require: true,
    },
    publication_date: {
      type: Date,
      default: Date.now(),
      require: true,
    },
    rank: {
      type: Number,
      default: 0,
      require: true,
    },
    userId: {
      type: String,
      require: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        ret.author = `Mr/MS ${ret.author}`;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

bookSchema.statics.build = (attrs: BookAttr) => {
  return new Book(attrs);
};

const Book = mongoose.model<BookDoc, BookModel>('Book', bookSchema);

export { Book };
