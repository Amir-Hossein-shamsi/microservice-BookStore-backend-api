import request from 'supertest';
import { app } from '../../app';
import { Book } from '../../models/book';

it('fetches the order', async () => {
	// Create a ticket
	const ticket = Book.build({
		title: 'concert',
		price: 20,
	});
	await ticket.save();

	const user = global.signin();
	// make a request to build an order with this ticket
	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ bookId: ticket.id })
		.expect(201);

	// make request to fetch the order
	const { body: fetchedOrder } = await request(app)
		.get(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.send()
		.expect(200);

	expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
	// Create a ticket
	const book = Book.build({
		title: 'concert',
		price: 20,
	});
	await book.save();

	const user = global.signin();
	// make a request to build an order with this ticket
	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ bookId: book.id })
		.expect(201);

	// make request to fetch the order
	await request(app)
		.get(`/api/orders/${order.id}`)
		.set('Cookie', global.signin())
		.send()
		.expect(401);
});
