import { Request, Response, NextFunction } from "express";

export const getAllPaymentAccounts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const paymentAccounts = await req.request.toPaymentServer(req.originalUrl, {
		method: "GET",
	});

	res.ok(paymentAccounts);
};

export const getPaymentAccount = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const paymentAccount = await req.request.toPaymentServer(req.originalUrl, {
		method: "GET",
	});

	res.ok(paymentAccount);
};

export const createPaymentAccount = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.body.user) req.body.user = req.user?.id;

	const paymentAccount = await req.request.toPaymentServer(req.originalUrl, {
		method: "POST",
		data: req.body,
	});

	res.created(paymentAccount);
};

export const updatePaymentAccount = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const paymentAccount = await req.request.toPaymentServer(req.originalUrl, {
		method: "PATCH",
		data: req.body,
	});

	res.ok(paymentAccount);
};

export const deletePaymentAccount = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const paymentAccount = await req.request.toPaymentServer(req.originalUrl, {
		method: "DELETE",
	});

	res.noContent();
};
