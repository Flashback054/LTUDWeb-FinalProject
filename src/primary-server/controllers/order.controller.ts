import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Payment from "../../payment-server/models/payment.model";
import Book from "../models/book.model";
import Order from "../models/order.model";
import ControllerFactory from "../../commons/controllers/controller.factory";
import AppError from "../../commons/utils/AppError";

export const getAllOrders = ControllerFactory.getAll(Order, {
	populate: [
		{
			path: "orderDetails.book",
			select: "name image",
		},
		{
			path: "user",
			select: "name email",
		},
	],
	allowNestedQueries: ["user"],
});
export const getOrder = ControllerFactory.getOne(Order, {
	populate: [
		{
			path: "orderDetails.book",
			select: "name image",
		},
		{
			path: "user",
			select: "name email",
		},
	],
});
export const createOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Get user from req.user
	const { user, orderDetails } = req.body;

	const userId = user || req.user?.id;
	let order;
	// For each orderDetails, check if orderDetails.quantity <= Book.quantity
	// Use mongoose Session to rollback if any orderDetails.quantity > Book.quantity
	const session = await mongoose.startSession();
	// Substract all today
	try {
		session.startTransaction();

		for (const item of orderDetails) {
			// findOneAndUpdate() is atomic on single document
			const updatedBook = await Book.findOneAndUpdate(
				{ _id: item.book, quantity: { $gte: item.quantity } },
				{ $inc: { quantity: -item.quantity } },
				{ new: true, session }
			);

			if (!updatedBook) {
				throw new AppError(
					400,
					"NOT_ENOUGH_QUANTITY",
					`Số lượng ${item.name} không đủ để đặt hàng`,
					{
						book: `Số lượng ${item.name} không đủ để đặt hàng`,
					}
				);
			}
		}

		const totalPrice = orderDetails.reduce((acc, item) => {
			return acc + item.price * item.quantity;
		}, 0);
		const finalPrice = totalPrice;

		const orders = await Order.create(
			[
				{
					user: userId,
					orderDetails,
					totalPrice,
					finalPrice,
					status: "paid",
				},
			],
			{ session }
		);
		order = orders[0];

		const payment = await req.request.toPaymentServer(`/api/v1/payments`, {
			method: "POST",
			data: {
				user: userId,
				totalPrice,
				finalPrice: totalPrice,
				order: order.id,
			},
		});

		await session.commitTransaction();
		session.endSession();
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		throw error;
	}

	// Populate order.orderDetails.book and order.user
	await order.populate([
		{
			path: "orderDetails.book",
			select: "name image",
		},
		{
			path: "user",
			select: "name email",
		},
	]);

	// Send response
	res.created(order);
};
export const updateOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let order = await Order.findById(req.params.id);

	if (!order) {
		throw new AppError(
			404,
			"NOT_FOUND",
			`Không tìm thấy order với ID ${req.params.id}`,
			{
				id: req.params.id,
			}
		);
	}

	// if (order.status === "cancelled") {
	// 	throw new AppError(
	// 		400,
	// 		"BAD_REQUEST",
	// 		"Không thể cập nhật order đã bị hủy"
	// 	);
	// }

	// if (order.status === "completed") {
	// 	throw new AppError(
	// 		400,
	// 		"BAD_REQUEST",
	// 		"Không thể cập nhật order đã hoàn thành"
	// 	);
	// }

	// const { status } = req.body;

	// // Check if status is updated to "preparing" or "completed"
	// if (status === "paid" || status === "shipping") {
	// 	// Only admin  can update status when it is "paid" or "shipping"
	// 	// Used to update status from "paid" -> "shipping" -> "completed"
	// 	if (req.user.role !== "admin") {
	// 		throw new AppError(
	// 			403,
	// 			"FORBIDDEN",
	// 			"Bạn không có quyền cập nhật trạng thái hoàn thành cho đơn hàng",
	// 			{
	// 				status,
	// 			}
	// 		);
	// 	}

	// 	order.status = status;
	// 	await order.save();
	// }
	// Check if status is updated to "cancelled"
	if (req.body.status === "cancelled") {
		// Start a transaction
		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			// 2) Refund Book.quantity
			for (const item of order.orderDetails) {
				const refundedBook = await Book.findOneAndUpdate(
					{ _id: item.book },
					{ $inc: { quantity: item.quantity } },
					{ new: true, runValidators: true, session }
				);
			}

			// 4) Update status to "cancelled"
			const payment = await Payment.findOneAndUpdate(
				{ order: order.id },
				{ status: "failed", paymentError: "Đơn hàng đã bị huỷ" },
				{ new: true, runValidators: true, session }
			);
			// TODO: Use VNPAY to refund money to user

			order.status = "cancelled";
			await order.save();

			await session.commitTransaction();
			session.endSession();
		} catch (error) {
			await session.abortTransaction();
			session.endSession();
			throw new AppError(
				500,
				"INTERNAL_SERVER_ERROR",
				"Có lỗi xảy ra trong quá trình huỷ đơn hàng"
			);
		}
	} else {
		order = await Order.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
	}

	// Populate order with orderDetails.book and user
	await order.populate([
		{
			path: "orderDetails.book",
			select: "name image",
			options: { lean: true },
		},
		{
			path: "user",
			select: "name email",
			options: { lean: true },
		},
	]);

	res.created(order);
};
export const deleteOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const order = await Order.findById(req.params.id);

	if (!order) {
		throw new AppError(
			404,
			"NOT_FOUND",
			`Không tìm thấy order với ID ${req.params.id}`,
			{
				id: req.params.id,
			}
		);
	}

	if (order.status !== "cancelled") {
		// Start a transaction
		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			// 2) Refund Book.quantity
			for (const item of order.orderDetails) {
				const refundedBook = await Book.findOneAndUpdate(
					{ _id: item.book },
					{ $inc: { quantity: item.quantity } },
					{ new: true, runValidators: true, session }
				);
			}

			// 3) Delete Payment
			const payment = await Payment.findOneAndDelete(
				{ order: order.id },
				{ session }
			);

			// 4) Delete Order
			await Order.findByIdAndDelete(order.id, { session });

			await session.commitTransaction();
			session.endSession();
		} catch (error) {
			await session.abortTransaction();
			session.endSession();
			throw new AppError(
				500,
				"INTERNAL_SERVER_ERROR",
				"Có lỗi xảy ra trong quá trình huỷ đơn hàng"
			);
		}
	} else {
		await Order.findByIdAndDelete(order.id);
	}

	res.noContent();
};

// Middleware
export const checkOrderOwnership = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.user.role === "admin") {
		return next();
	}

	const order =
		req.order || (await Order.findById(req.params.id).lean({ virtuals: true }));

	if (!order) {
		throw new AppError(
			404,
			"NOT_FOUND",
			`Không tìm thấy order với ID ${req.params.id}`,
			{
				id: req.params.id,
			}
		);
	}

	if (!order.user || order.user.toString() !== req.user.id.toString()) {
		throw new AppError(
			403,
			"FORBIDDEN",
			"Bạn không có quyền truy cập vào order của người khác"
		);
	}

	req.order = order;
	next();
};

export const checkOrderStatus = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.user.role === "admin") {
		return next();
	}

	const order =
		req.order || (await Order.findById(req.params.id).lean({ virtuals: true }));

	if (!order) {
		throw new AppError(
			404,
			"NOT_FOUND",
			`Không tìm thấy order với ID ${req.params.id}`,
			{
				id: req.params.id,
			}
		);
	}

	if (order.status === "completed") {
		throw new AppError(
			403,
			"FORBIDDEN",
			"Bạn không thể thay đổi order đã hoàn thành"
		);
	}

	if (order.status === "cancelled") {
		throw new AppError(403, "FORBIDDEN", "Bạn không thể thay đổi order đã hủy");
	}

	if (order.status === "shipping") {
		throw new AppError(
			403,
			"FORBIDDEN",
			"Bạn không thể thay đổi order đang giao hàng"
		);
	}

	if (order.status === "paid") {
		throw new AppError(
			403,
			"FORBIDDEN",
			"Bạn không thể thay đổi order đã thanh toán"
		);
	}

	req.order = order;
	next();
};

export const checkGetAllOrdersPermission = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.user.role === "admin") {
		return next();
	}

	const userId = req.user.id;
	if (
		!req.params.user ||
		(req.params.user && req.params.user !== userId.toString())
	) {
		throw new AppError(
			403,
			"FORBIDDEN",
			"Bạn không có quyền truy cập vào order của người khác"
		);
	}

	next();
};

export const payOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const order = await Order.findById(req.params.id);

	if (!order) {
		throw new AppError(
			404,
			"NOT_FOUND",
			`Không tìm thấy order với ID ${req.params.id}`,
			{
				id: req.params.id,
			}
		);
	}

	if (
		order.status === "completed" ||
		order.status === "cancelled" ||
		order.status === "shipping" ||
		order.status === "paid"
	) {
		throw new AppError(
			403,
			"FORBIDDEN",
			"Bạn chỉ có thể thanh toán order đang chờ thanh toán"
		);
	}

	const payment = await Payment.create({
		order: order.id,
		status: "success",
		paymentDate: Date.now(),
		description: `Thanh toán đơn hàng ${order.id}`,
		totalPrice: order.totalPrice,
		finalPrice: order.finalPrice,
	});

	// Update order status to "paid"
	order.status = "paid";
	await order.save();

	// Populate order with orderDetails.book and user
	await order.populate([
		{
			path: "orderDetails.book",
			select: "name image",
			options: { lean: true },
		},
		{
			path: "user",
			select: "name email",
			options: { lean: true },
		},
	]);

	// Send response
	res.created(order);
};
