import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import {
	authRequired,
	OrderStatus,
	GeneralError,
} from '@aroona/commonhandeller';
import { body } from 'express-validator';
import { Book } from '../models/book';
import { Order } from '../models/order';
// import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
// import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
	'/api/orders',
	authRequired,
	[
		body('bookId')
			.not()
			.isEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage('TicketId must be provided'),
	],
	async (req: Request, res: Response) => {
		const { bookId } = req.body;

		// Find the ticket the user is trying to order in the database
		const book = await Book.findById(bookId);
		if (!book) {
			throw new GeneralError('not founded ', 404);
		}

		// Make sure that this ticket is not already reserved
		const isReserved = await book.isReserved();
		if (isReserved) {
			throw new GeneralError('Ticket is already reserved', 401);
		}

		// Calculate an expiration date for this order
		const expiration = new Date();
		expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

		// Build the order and save it to the database
		const order = Order.build({
			userId: req.auth!.id,
			status: OrderStatus.Created,
			expiresAt: expiration,
			book,
		});
		await order.save();

		// Publish an event saying that an order was created
		// new OrderCreatedPublisher(natsWrapper.client).publish({
		// 	id: order.id,
		// 	status: order.status,
		// 	userId: order.userId,
		// 	expiresAt: order.expiresAt.toISOString(),
		// 	ticket: {
		// 		id: ticket.id,
		// 		price: ticket.price,
		// 	},
		// });

		res.status(201).send(order);
	}
);

export { router as newOrderRouter };
