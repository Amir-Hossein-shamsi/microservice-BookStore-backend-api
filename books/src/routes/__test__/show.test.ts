import fakerequest from 'supertest';
import { app } from '../../app.module';
import mongoose from 'mongoose';

it('Returns an 404 error if there is not any item with strange id', async () => {
  await fakerequest(app)
    .get(`/api/books/${new mongoose.Types.ObjectId().toHexString()}`)
    .send({})
    .expect(404);
});

it('Returns 200 statusCode and show a successfully Request ', async () => {
  const responce = await fakerequest(app)
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
  const showitemRecord = await fakerequest(app)
    .get(`/api/books/${responce.body.id}`)
    .send()
    .expect(200);

  expect(showitemRecord.body.findingRecord.title).toEqual('not a fuck');
});
