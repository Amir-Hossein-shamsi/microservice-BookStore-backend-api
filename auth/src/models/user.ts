import mongoose from 'mongoose';
import { transform } from 'typescript';
import { Password } from '../services/password';

interface UserAttr {
  name: string;
  email: string;
  password: string;
}
interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttr): UserDoc;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: false,
      default: 'deafaultuser',
    },

    email: {
      type: String,
      require: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        ret.name = `+++ ${ret.name} +++`;
        delete ret._id;
        delete ret.password;
      },
      versionKey: false,
    },
  }
);

UserSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

UserSchema.statics.build = (attrs: UserAttr) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', UserSchema);

export { User };
