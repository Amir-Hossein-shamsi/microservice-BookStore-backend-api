import { app } from './app.module';

import mongoose from 'mongoose';
import { DatabaseValidationError } from '@aroona/commonhandeller';

const start = async () => {
  if (!process.env.JWT_KEY || !process.env.PORT_SERVER) {
    throw new Error('there is not any secret value for authorization');
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-service:27017/auth', {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log('database is running');
    app.listen(process.env.PORT_SERVER, () => {
      console.log(`listening  to ${process.env.PORT_SERVER} ! `);
    });
  } catch (err) {
    throw new DatabaseValidationError('DB is  ');
  }
};
start();
