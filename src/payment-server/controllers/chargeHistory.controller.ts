import { Request, Response, NextFunction } from "express";
import ChargeHistory from "../models/chargeHistory.model";
import ControllerFactory from "../../commons/controllers/controller.factory";
import PaymentAccount from "../models/paymentAccount.model";
import AppError from "../../commons/utils/AppError";

export const getAllChargeHistories = ControllerFactory.getAll(ChargeHistory, {
	populate: {
		path: "user",
		select: "name email",
	},
	allowNestedQueries: ["user"],
});

export const getChargeHistory = ControllerFactory.getOne(ChargeHistory, {
	populate: {
		path: "user",
		select: "name email",
	},
});

export const createChargeHistory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const userId = req.query.user;

	const paymentAccount = await PaymentAccount.findOne({ user: userId }).lean();
	if (!paymentAccount) {
		await PaymentAccount.create({
			user: userId,
		});
	}

	const { chargeAmount } = req.body;
	const chargeHistory = await ChargeHistory.create({
		user: userId,
		chargeAmount: chargeAmount,
		chargeDescription: `Nạp tiền vào tài khoản ${userId} số tiền ${chargeAmount} VNĐ`,
	});

	req.body.id = chargeHistory.id;
	req.body.amount = chargeHistory.chargeAmount;

	next();
};
