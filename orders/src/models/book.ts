import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface BookAttrs {
	title: string;
	price: number;
}

export interface BookDoc extends mongoose.Document {
	title: string;
	price: number;
	isReserved(): Promise<boolean>;
}

interface BookModel extends mongoose.Model<BookDoc> {
	build(attrs: BookAttrs): BookDoc;
}

const bookSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

bookSchema.statics.build = (attrs: BookAttrs) => {
	return new Book(attrs);
};
bookSchema.methods.isReserved = async function () {
	// this === the ticket document that we just called 'isReserved' on
	const existingOrder = await Order.findOne({
		book: this,
		status: {
			$in: [
				OrderStatus.Created,
				OrderStatus.AwaitingForPayment,
				OrderStatus.Completed,
			],
		},
	});

	return !!existingOrder;
};

const Book = mongoose.model<BookDoc, BookModel>('Book', bookSchema);

export { Book };
