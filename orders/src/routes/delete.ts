import express, { Request, Response } from 'express';
import { authRequired, GeneralError } from '@aroona/commonhandeller';
import { Order, OrderStatus } from '../models/order';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
	'/api/orders/:orderId',
	authRequired,
	async (req: Request, res: Response) => {
		const { orderId } = req.params;

		const order = await Order.findById(orderId).populate('ticket');

		if (!order) {
			throw new GeneralError('not founded', 404);
		}
		if (order.userId !== req.auth!.id) {
			throw new GeneralError('-----', 401);
		}
		order.status = OrderStatus.Canceled;
		await order.save();

		// // publishing an event saying this was cancelled!
		// new OrderCancelledPublisher(natsWrapper.client).publish({
		// 	id: order.id,
		// 	ticket: {
		// 		id: order.ticket.id,
		// 	},
		// });

		res.status(204).send(order);
	}
);

export { router as deleteOrderRouter };
