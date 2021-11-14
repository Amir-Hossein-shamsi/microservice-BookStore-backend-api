import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import fakeRequest from 'supertest';
import { app } from '../app.module';

declare global {
	namespace NodeJS {
		interface Global {
			getcookie(): string[];
		}
	}
}
jest.mock('../natswrapper');

let mongo: any;
beforeAll(async () => {
	process.env.JWT_KEY = 'asdadada';
	// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	mongo = new MongoMemoryServer();

	const uri = await mongo.getUri();

	await mongoose.connect(uri, {
		useNewUrlParser: true,

		useUnifiedTopology: true,
	});
});

beforeEach(async () => {
	jest.clearAllMocks();
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});

global.getcookie = () => {
	const payload = {
		id: new mongoose.Types.ObjectId().toHexString(),
		email: 'test@test.com',
	};
	const token = jwt.sign(payload, process.env.JWT_KEY!);
	const session = { jwt: token };
	const sessionJSON = JSON.stringify(session);
	const jsonbased64 = Buffer.from(sessionJSON).toString('base64');
	return [`express:sess=${jsonbased64}`];
};
