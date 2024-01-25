import Book from "../models/book.model";
import Order from "../models/order.model";
import { Request, Response, NextFunction } from "express";

export const countSellingBooks = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const countBooks = await Book.countDocuments({
		quantity: { $gt: 0 },
	});

	res.ok(countBooks);
};

export const countBooks = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const countBooks = await Book.countDocuments();

	res.ok(countBooks);
};

export const countNewOrders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { type } = req.query;

	const countNewOrders = await Order.countNewOrders(type as string);

	res.ok(countNewOrders);
};

// Top 5 low stock books
export const getTop5LowStockBooks = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const top5LowStockBooks = await Book.find({ quantity: { $lt: 5 } })
		.sort({ quantity: 1 })
		.limit(5);

	res.ok(top5LowStockBooks);
};

export const getRevenueAndProfitStats = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { type, startDate, endDate } = req.query;

	const revenueAndProfitStats = await Order.revenueAndProfitStatistics(
		type as string,
		startDate,
		endDate
	);

	res.ok(revenueAndProfitStats);
};

export const getBookSaleStats = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { type, startDate, endDate, sort } = req.query;
	
	const bookSaleStats = await Order.bookSaleStatistics(
		type as string,
		startDate,
		endDate,
		sort as string,
	);

	res.ok(bookSaleStats);
};
