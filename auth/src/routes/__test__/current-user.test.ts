import fakeRequest from 'supertest';
import { app } from '../../app.module';

it('responds with details about the current user', async () => {
  const cookie = await global.getcookie();
  const response = await fakeRequest(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(response.body.CurrentUser.email).toEqual('test@test.com');
});

it('responds with null if not authorization', async () => {
  const response = await fakeRequest(app)
    .get('/api/users/currentuser')
    .send()
    .expect(400);
  expect(response.body.CurrentUser).toEqual(undefined);
});
