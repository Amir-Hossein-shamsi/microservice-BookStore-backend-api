import express, { Request, Response } from 'express';
import { authRequired, GeneralError } from '@aroona/commonhandeller';
import { Order } from '../models/order';

const router = express.Router();

router.get(
	'/api/orders/:orderId',
	authRequired,
	async (req: Request, res: Response) => {
		const order = await Order.findById(req.params.orderId).populate('ticket');

		if (!order) {
			throw new GeneralError('not founded ', 404);
		}
		if (order.userId !== req.auth!.id) {
			throw new GeneralError('----------', 401);
		}

		res.send(order);
	}
);

export { router as showOrderRouter };
