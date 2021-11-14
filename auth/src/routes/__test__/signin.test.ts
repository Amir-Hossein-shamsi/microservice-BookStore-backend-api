import fakeRequest from 'supertest';
import { app } from '../../app.module';

it('fails when a email that does not exist is supplied', async () => {
  return fakeRequest(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '123456789',
    })
    .expect(401);
});

it('fails when an incorrect password is supplied', async () => {
  await fakeRequest(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456789',
    })
    .expect(201);

  await fakeRequest(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'amir',
    })
    .expect(401);
});

it('responds with a cookie when given valid credential ', async () => {
  await fakeRequest(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456789',
    })
    .expect(201);

  const response = await fakeRequest(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '123456789',
    })
    .expect(200);
  expect(response.get('Set-Cookie')).toBeDefined();
});
