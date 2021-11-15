import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Book } from '../../models/book';
// import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
	const ticketId = mongoose.Types.ObjectId();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId })
		.expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
	const book = Book.build({
		title: 'concert',
		price: 20,
	});
	await book.save();
	const order = Order.build({
		book,
		userId: 'laskdflkajsdf',
		status: OrderStatus.Created,
		expiresAt: new Date(),
	});
	await order.save();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId: book.id })
		.expect(400);
});

it('reserves a ticket', async () => {
	const book = Book.build({
		title: 'concert',
		price: 20,
	});
	await book.save();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ bookId: book.id })
		.expect(201);
});

// it('emits an order created event', async () => {
// 	const book = Book.build({
// 		title: 'concert',
// 		price: 20,
// 	});
// 	await book.save();

// 	await request(app)
// 		.post('/api/orders')
// 		.set('Cookie', global.signin())
// 		.send({ bookId: book.id })
// 		.expect(201);

// 	expect(natsWrapper.client.publish).toHaveBeenCalled();
// });
