import fakerequest from 'supertest';
import { app } from '../../app.module';
import { Book } from '../../models/book';
import { nastsWrapper } from '../../natswrapper';

it('has a route a handler listening to /api/books for post requests', async () => {
	const response = await fakerequest(app).post('/api/books').send({});

	expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in ! ', async () => {
	const responce = await fakerequest(app).post('/api/books').send({});
	expect(responce.status).toEqual(401);
});

it('Just authentication was successful ! ', async () => {
	const responce = await fakerequest(app)
		.post('/api/books')
		.set('Cookie', global.getcookie())
		.send({});
	expect(responce.status).not.toEqual(401);
});

it('successfully request for creating a new record of book', async () => {
	const cookie = global.getcookie();
	let bookRecords = await Book.find({});
	expect(bookRecords.length).toEqual(0);

	const responce = await fakerequest(app)
		.post('/api/books')
		.set('Cookie', cookie)
		.send({
			title: 'not a fuck',
			price: 10,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'Mark Manson',
			rank: 3.4,
		})
		.expect(201);
	bookRecords = await Book.find({});

	expect(bookRecords.length).toEqual(1);
	expect(bookRecords[0].price).toEqual(10);
	expect(bookRecords[0].title).toEqual('not a fuck');
});

it('publised the events Successful', async () => {
	const cookie = global.getcookie();
	let bookRecords = await Book.find({});
	expect(bookRecords.length).toEqual(0);

	const responce = await fakerequest(app)
		.post('/api/books')
		.set('Cookie', cookie)
		.send({
			title: 'not a fuck',
			price: 10,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'Mark Manson',
			rank: 3.4,
		})
		.expect(201);
	expect(nastsWrapper.client.publish).toHaveBeenCalled();
});

it('Get Error if there is invalid item in body', async () => {
	const cookie = global.getcookie();
	await fakerequest(app)
		.post('/api/books')
		.set('Cookie', cookie)
		.send({
			title: '',
			price: 10,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'Mark Manson',
			rank: 3.4,
		})
		.expect(400);

	await fakerequest(app)
		.post('/api/books')
		.set('Cookie', cookie)
		.send({
			title: 'asdd',

			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'Mark Manson',
			rank: 3.4,
		})
		.expect(400);

	await fakerequest(app)
		.post('/api/books')
		.set('Cookie', cookie)
		.send({
			title: 'asdd',
			price: 10,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			rank: 3.4,
		})
		.expect(400);

	await fakerequest(app)
		.post('/api/books')
		.set('Cookie', cookie)
		.send({
			title: 'asdd',
			price: 10,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'Mark Manson',
		})
		.expect(400);
});
