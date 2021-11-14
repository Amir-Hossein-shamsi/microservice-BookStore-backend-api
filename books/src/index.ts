import { app } from './app.module';

import mongoose from 'mongoose';
import { nastsWrapper } from './natswrapper';
import { DatabaseValidationError } from '@aroona/commonhandeller';

const start = async () => {
	if (!process.env.JWT_KEY || !process.env.MONGO_URI) {
		throw new Error('there is not any secret value !');
	}
	try {
		await nastsWrapper.connect(
			'book',
			'adddaadert',
			'http://nats-streaming-service:4222'
		);
		nastsWrapper.client.on('close', () => {
			console.log('Nats connection closed!');
			process.exit;
		});
		process.on('SIGINT', () => nastsWrapper.client.close());
		process.on('SIGTERM', () => nastsWrapper.client.close());

		await mongoose.connect(process.env.MONGO_URI!, {
			useCreateIndex: true,
			useNewUrlParser: true,

			useUnifiedTopology: true,
		});
		console.log('database is running');
		app.listen(3000, () => {
			console.log('listening  to 3000 ! ');
		});
	} catch (err) {
		console.error(err);

		throw new DatabaseValidationError('DB was broken  ');
	}
};
start();
