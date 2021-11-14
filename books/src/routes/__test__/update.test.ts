import fakerequest from 'supertest';
import { app } from '../../app.module';
import mongoose from 'mongoose';
import { nastsWrapper } from '../../natswrapper';

it('Returns 404 if the provided id does not exist !', async () => {
	const fakeID = new mongoose.Types.ObjectId().toHexString();
	const co = global.getcookie();
	await fakerequest(app)
		.post('/api/books')
		.set('Cookie', co)
		.send({
			title: 'not a fuck',
			price: 10,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'Mark Manson',
			rank: 3.4,
		})
		.expect(201);

	await fakerequest(app)
		.patch(`/api/books/${fakeID}`)
		.set('Cookie', co)
		.send({
			title: 'fuck',
			price: 10,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'Mark Manson',
			rank: 2.4,
		})
		.expect(404);
});

it('Returns 401 (error authorization ) if the user did not sign in ', async () => {
	const response = await fakerequest(app)
		.post('/api/books')
		.set('Cookie', global.getcookie())
		.send({
			title: 'not a fuck',
			price: 10,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'Mark Manson',
			rank: 3.4,
		})
		.expect(201);

	await fakerequest(app)
		.patch(`/api/books/${response.body.id}`)
		.send({
			title: 'not a fuck',
			price: 10,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'Mark Manson',
			rank: 3.8,
		})
		.expect(401);
});

it('Returns 401 if the user is not owner of that book ', async () => {
	const co = global.getcookie();
	const response = await fakerequest(app)
		.post('/api/books')
		.set('Cookie', co)
		.send({
			title: 'not a fuck',
			price: 10,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'Mark Manson',
			rank: 3.4,
		})
		.expect(201);

	await fakerequest(app)
		.patch(`/api/books/${response.body.id}`)
		.set('Cookie', global.getcookie())
		.send({
			title: 'fuck',
			price: 10,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'Mark Manson',
			rank: 3.8,
		})
		.expect(401);
});

it('Returns 400 if the user write invalid value ! ', async () => {
	const co = global.getcookie();
	const response = await fakerequest(app)
		.post('/api/books')
		.set('Cookie', co)
		.send({
			title: 'not a fuck',
			price: 10,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'Mark Manson',
			rank: 3.4,
		})
		.expect(201);

	await fakerequest(app)
		.patch(`/api/books/${response.body.id}`)
		.set('Cookie', co)
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
		.patch(`/api/books/${response.body.id}`)
		.set('Cookie', co)
		.send({
			price: -2,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'Mark Manson',
			rank: 3.4,
			title: 'not a fuck',
		})
		.expect(400);

	await fakerequest(app)
		.patch(`/api/books/${response.body.id}`)
		.set('Cookie', co)
		.send({
			price: -2,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: '',
			rank: 3.4,
			title: 'not a fuck',
		})
		.expect(400);

	await fakerequest(app)
		.patch(`/api/books/${response.body.id}`)
		.set('Cookie', co)
		.send({
			price: -2,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'Mark Manson',
			rank: -2,
			title: 'not a fuck',
		})
		.expect(400);

	await fakerequest(app)
		.patch(`/api/books/${response.body.id}`)
		.set('Cookie', co)
		.send({
			price: -8,
			author: 'Mark Manson',
			rank: 12,
			title: 'not a fuck',
		})
		.expect(400);
});

it('Returns 200 and it shows us updating was correcting !', async () => {
	const co = global.getcookie();
	const response = await fakerequest(app)
		.post('/api/books')
		.set('Cookie', co)
		.send({
			title: 'not a fuck',
			price: 10,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'Mark Manson',
			rank: 3.4,
		})
		.expect(201);

	const record = await fakerequest(app)
		.patch(`/api/books/${response.body.id}`)
		.set('Cookie', co)
		.send({
			title: 'test',
			price: 20,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'bob Manson',
			rank: 2,
		})
		.expect(200);
});

it('published the events has been successfu !', async () => {
	const co = global.getcookie();
	const response = await fakerequest(app)
		.post('/api/books')
		.set('Cookie', co)
		.send({
			title: 'not a fuck',
			price: 10,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'Mark Manson',
			rank: 3.4,
		})
		.expect(201);

	const record = await fakerequest(app)
		.patch(`/api/books/${response.body.id}`)
		.set('Cookie', co)
		.send({
			title: 'test',
			price: 20,
			description:
				'labore Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content',
			author: 'bob Manson',
			rank: 2,
		})
		.expect(200);
	expect(nastsWrapper.client.publish).toHaveBeenCalled();
});
