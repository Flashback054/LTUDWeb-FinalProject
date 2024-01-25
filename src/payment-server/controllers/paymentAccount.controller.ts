import { Request, Response, NextFunction } from "express";
import PaymentAccount from "../models/paymentAccount.model";
import ControllerFactory from "../../commons/controllers/controller.factory";
import AppError from "../../commons/utils/AppError";

export const getAllPaymentAccounts = ControllerFactory.getAll(PaymentAccount, {
	populate: {
		path: "user",
		select: "name email",
	},
});
export const getPaymentAccount = ControllerFactory.getOne(PaymentAccount, {
	populate: {
		path: "user",
		select: "name email",
	},
});
export const createPaymentAccount = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const userId = req.body.user;
	const existingPaymentAccount = await PaymentAccount.findOne({
		user: userId,
	});
	if (existingPaymentAccount) {
		throw new AppError(
			400,
			"DUPLICATE_KEYS",
			"Tài khoản thanh toán đã tồn tại.",
			{ user: userId }
		);
	}

	const paymentAccount = await PaymentAccount.create({
		user: userId,
	});

	res.ok(paymentAccount);
};
export const updatePaymentAccount = ControllerFactory.updateOne(PaymentAccount);
export const deletePaymentAccount = ControllerFactory.deleteOne(PaymentAccount);
