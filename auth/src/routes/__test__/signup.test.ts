import fakeRequest from 'supertest';
import { app } from '../../app.module';

it('returns a 201 on successful signup', async () => {
  return fakeRequest(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456789',
    })
    .expect(201);
});

it('returns a 400 invalid email', async () => {
  return fakeRequest(app)
    .post('/api/users/signup')
    .send({
      email: 'tes',
      password: '123456789',
    })
    .expect(400);
});

it('returns a 400 with an invaid password', async () => {
  return fakeRequest(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '9',
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await fakeRequest(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
    })
    .expect(400);

  await fakeRequest(app)
    .post('/api/users/signup')
    .send({
      password: '1',
    })
    .expect(400);
});

it('disallowed duplicate emails', async () => {
  await fakeRequest(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456789',
    })
    .expect(201);

  await fakeRequest(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '12345678999',
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await fakeRequest(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '123456789',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
