import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import fakeRequest from 'supertest';
import { app } from '../app.module';

declare global {
  namespace NodeJS {
    interface Global {
      getcookie(): Promise<string[]>;
    }
  }
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdadada';
  mongo = new MongoMemoryServer();

  const uri = await mongo.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,

    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.getcookie = async () => {
  const email = 'test@test.com';
  const password = '1234567899';

  const response = await fakeRequest(app)
    .post('/api/users/singup')
    .send({
      email,
      password,
    })
    .expect(201);
  const cookie = response.get('Set-Cookie');
  return cookie;
};
