import fakerequest from 'supertest';
import { app } from '../../app.module';
import mongoose from 'mongoose';
import { Book } from '../../models/book';

it('Returns 404 if the path or the ID is wrong', async () => {
  const fakeID = new mongoose.Types.ObjectId().toHexString();

  await fakerequest(app)
    .delete(`/api/books/${fakeID}`)
    .set('Cookie', global.getcookie())
    .send()
    .expect(404);
});

it('Returns 401 the user is not sign in at all ', async () => {
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
    .delete(`/api/books/${response.body.id}`)
    .send()
    .expect(401);
});

it('Returns 401 the user is not own the book in order to delete it ', async () => {
  const cookie = global.getcookie();
  const response = await fakerequest(app)
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

  await fakerequest(app)
    .delete(`/api/books/${response.body.id}`)
    .set('Cookie', global.getcookie())
    .send()
    .expect(401);
});

it('Returns 200 and means delete request was successfully', async () => {
  const cookie = global.getcookie();
  let listBooks = await Book.find({});

  const response = await fakerequest(app)
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

  listBooks = await Book.find({});

  expect(listBooks.length).toEqual(1);

  await fakerequest(app)
    .delete(`/api/books/${response.body.id}`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  listBooks = await Book.find({});
  expect(listBooks.length).toEqual(0);
});
