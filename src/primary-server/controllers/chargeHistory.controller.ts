import ChargeHistory, { IChargeHistory } from "../models/chargeHistory.model";
import ControllerFactory from "../../commons/controllers/controller.factory";
import User from "../models/user.model";
import AppError from "../../commons/utils/AppError";
import { Request, Response, NextFunction } from "express";

exports.getAllChargeHistories = ControllerFactory.getAll(ChargeHistory, {
	populate: { path: "user", select: "name email" },
	allowNestedQueries: ["user"],
});
exports.getChargeHistory = ControllerFactory.getOne(ChargeHistory, {
	populate: {
		path: "user",
		select: "name email",
	},
});
exports.deleteChargeHistory = ControllerFactory.deleteOne(ChargeHistory);
exports.updateChargeHistory = ControllerFactory.updateOne(ChargeHistory);

exports.createChargeHistory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { chargeAmount } = req.body;

	let newCharge: IChargeHistory = {
		user: req.user.id,
		chargeAmount,
		chargeStatus: "pending",
		chargeDescription: `Nap tien cho tai khoan ${req.user.email} voi so tien ${chargeAmount}`,
	};

	// Create a new charge history in database
	const chargeHistory = await ChargeHistory.create(newCharge);
	// If charge method is vnpay, create a new vnpay charge
	req.body.id = chargeHistory.id;
	req.body.amount = chargeHistory.chargeAmount;
	req.body.orderDescription = chargeHistory.chargeDescription;

	// Call next to proceed to VNPAY controller
	next();
};
