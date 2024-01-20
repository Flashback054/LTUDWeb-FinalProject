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

	res.status(200).json({
		data: countBooks,
	});
};

export const countBooks = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const countBooks = await Book.countDocuments();

	res.status(200).json({
		data: countBooks,
	});
};

export const countNewOrders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { type } = req.query;

	const countNewOrders = await Order.countNewOrders(type as string);

	res.status(200).json({
		data: countNewOrders,
	});
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

	res.status(200).json({
		data: top5LowStockBooks,
	});
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

	res.status(200).json({
		data: revenueAndProfitStats,
	});
};

export const getBookSaleStats = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { type, startDate, endDate } = req.query;

	const bookSaleStats = await Order.bookSaleStatistics(
		type as string,
		startDate,
		endDate
	);

	res.status(200).json({
		data: bookSaleStats,
	});
};
