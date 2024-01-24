import Payment from "../models/payment.model";
import PaymentAccount from "../models/paymentAccount.model";
import ControllerFactory from "../../commons/controllers/controller.factory";
import { Request, Response, NextFunction } from "express";
import { optional } from "zod";

export const getAllPayments = ControllerFactory.getAll(Payment, {
	allowNestedQueries: ["user"],
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
export const createPayment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const newPayment = await Payment.create(req.body);
        const userAccount = await PaymentAccount.findOne({ user: newPayment.user });
        const adminAccount = await PaymentAccount.findOne({ isAdminAccount: true });

        if (userAccount.balance >= newPayment.finalPrice) {
            userAccount.balance -= newPayment.finalPrice;
            adminAccount.balance += newPayment.finalPrice;

            await userAccount.save();
            await adminAccount.save();

            res.created(newPayment);
        } else {
            res.status(400).send("Không đủ số dư trong tài khoản");
        }
	} catch (err) {

		throw err;
	}

};
export const updatePayment = ControllerFactory.updateOne(Payment);
export const deletePayment = ControllerFactory.deleteOne(Payment);
