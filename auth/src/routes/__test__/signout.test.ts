import fakeRequest from 'supertest';
import { app } from '../../app.module';

it('clears the cookie after signing out ', async () => {
  const cookie = await global.getcookie();
  const response = await fakeRequest(app)
    .post('/api/users/signout')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(response.get('Set-Cookie')[0]).toContain('path=/');
});
