import { Request, Response, NextFunction } from "express";

export const getAllPayments = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const payments = await req.request.toPaymentServer(req.originalUrl, {
		method: "GET",
	});

	res.ok(payments);
};

export const getPayment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const payment = await req.request.toPaymentServer(req.originalUrl, {
		method: "GET",
	});

	res.ok(payment);
};

export const createPayment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.body.user) req.body.user = req.user?.id;

	const payment = await req.request.toPaymentServer(req.originalUrl, {
		method: "POST",
		data: req.body,
	});

	res.created(payment);
};

export const updatePayment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const payment = await req.request.toPaymentServer(req.originalUrl, {
		method: "PATCH",
		data: req.body,
	});

	res.ok(payment);
};

export const deletePayment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const payment = await req.request.toPaymentServer(req.originalUrl, {
		method: "DELETE",
	});

	res.noContent();
};

export const getAllPaymentsByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
	const userId = req.user?.id;

	if (!userId) {
		res.badRequest("Không tìm thấy ID người dùng" );
	}
	else{
		const url = `${req.baseUrl}?user=${userId}`;
		const payments = await req.request.toPaymentServer(url, { method: "GET" });
	
		res.ok(payments);
	}
};

