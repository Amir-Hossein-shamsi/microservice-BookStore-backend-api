import express, { Response, Request } from 'express';
import { signup_validator, validatorChecker } from '../services/validators';
import { signin_validator } from '../services/validators';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import {
  authorizationUser,
  authRequired,
  GeneralError,
} from '@aroona/commonhandeller';
import { Password } from '../services/password';

const router = express.Router();

router.get(
  '/currentuser',
  authorizationUser,
  async (req: Request, res: Response) => {
    res.send({ CurrentUser: req.auth || null });
  }
);

router.post(
  '/signin',
  signin_validator,
  validatorChecker,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existinguser = await User.findOne({ email });
    if (!existinguser) {
      throw new GeneralError('there is not  any account by this email  ', 401);
    }
    const passwordcheacher = await Password.compare(
      existinguser.password,
      password
    );
    if (!passwordcheacher) {
      throw new GeneralError('this password is wrong plz try again', 401);
    }

    const userJwt = jwt.sign(
      {
        id: existinguser.id,
        email: existinguser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existinguser);
  }
);

router.post(
  '/signup',
  signup_validator,
  validatorChecker,
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) {
      throw new GeneralError('there is a account by this email  ', 400);
    }
    const user = User.build({ name, email, password });
    await user.save();

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };
    //throw new DatabaseValidationError('db is not codding');
    res.status(201).send({ status: 'Add a new user successfully' });
  }
);

router.post(
  '/signout',
  authorizationUser,
  authRequired,
  async (req: Request, res: Response) => {
    req.session = null;
    res.send({ status: 'you signing out correctly' });
  }
);

export { router as authRouter };
