import fakerequest from 'supertest';
import { app } from '../../app.module';
import mongoose from 'mongoose';

const createSomeRecord = async (n: number) => {
  for (let index = 0; index < n; index++) {
    await fakerequest(app)
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
  }
};

it('Show all of Record and return 200 statusCode', async () => {
  await createSomeRecord(3);
  const responce = await fakerequest(app).get('/api/books').send().expect(200);
  expect(responce.body).not.toBeNull();
  expect(responce.body.length).toEqual(3);
});

it('Show a specific message when there is not any Records', async () => {
  const responce = await fakerequest(app).get('/api/books').send().expect(200);

  expect(responce.text).toEqual('there is not any Records');
});
