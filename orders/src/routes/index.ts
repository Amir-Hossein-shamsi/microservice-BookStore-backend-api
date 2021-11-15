import express, { Request, Response } from 'express';
import { authRequired } from '@aroona/commonhandeller';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', authRequired, async (req: Request, res: Response) => {
	const orders = await Order.find({
		userId: req.auth!.id,
	}).populate('ticket');

	res.send(orders);
});

export { router as indexOrderRouter };
