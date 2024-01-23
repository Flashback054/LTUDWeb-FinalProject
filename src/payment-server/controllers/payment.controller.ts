import Payment from "../models/payment.model";
import ControllerFactory from "../../commons/controllers/controller.factory";

export const getAllPayments = ControllerFactory.getAll(Payment, {
	allowNestedQueries: ["userId"],
	populate: {
		path: "order",
		populate: {
			path: "user",
			select: "name email",
		},
	},
});
export const getPayment = ControllerFactory.getOne(Payment, {
	populate: {
		path: "order",
		populate: {
			path: "user",
			select: "name email",
		},
	},
});
export const createPayment = ControllerFactory.createOne(Payment);
export const updatePayment = ControllerFactory.updateOne(Payment);
export const deletePayment = ControllerFactory.deleteOne(Payment);
