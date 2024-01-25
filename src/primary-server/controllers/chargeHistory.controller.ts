import AppError from "../../commons/utils/AppError";
import { Request, Response, NextFunction } from "express";

export const getAllChargeHistories = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const chargeHistories = await req.request.toPaymentServer(req.originalUrl, {
		method: "GET",
	});

	res.ok(chargeHistories);
};

export const getChargeHistory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const chargeHistory = await req.request.toPaymentServer(req.originalUrl, {
		method: "GET",
	});

	res.ok(chargeHistory);
};

export const createChargeHistory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.redirect(
		307,
		process.env.PAYMENT_SERVER_URL + req.originalUrl + `?user=${req.user.id}`
	);
};
