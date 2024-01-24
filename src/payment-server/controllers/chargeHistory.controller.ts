import { Request, Response, NextFunction } from "express";
import ChargeHistory from "../models/chargeHistory.model";
import ControllerFactory from "../../commons/controllers/controller.factory";

export const getAllChargeHistories = ControllerFactory.getAll(ChargeHistory, {
	populate: {
		path: "user",
		select: "name email",
	},
	allowNestedQueries: ["userId"],
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
	const user = req.user;
	const { amount } = req.body;
	const chargeHistory = await ChargeHistory.create({
		user: user.id,
		chargeAmount: amount,
		chargeDescription: `Nạp tiền vào tài khoản ${user.email} số tiền ${amount} VNĐ`,
	});

	req.body.id = chargeHistory.id;
	req.body.amount = chargeHistory.chargeAmount;

	next();
};
