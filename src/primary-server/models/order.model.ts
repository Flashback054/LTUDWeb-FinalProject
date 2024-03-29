import mongoose, { Types } from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import {
	addMissingDates,
	addMissingBooks,
} from "../../commons/utils/statisticsHelper";
import AppError from "../../commons/utils/AppError";

interface IOrderDetail {
	id: Types.ObjectId;
	book: mongoose.Types.ObjectId;
	quantity: number;
	price: number;
}

export interface IOrder {
	id: Types.ObjectId;
	user: mongoose.Types.ObjectId;
	orderDate: Date;
	status: string;
	description: string;
	totalPrice: number;
	finalPrice: number;
	orderDetails: Types.DocumentArray<IOrderDetail>;
}

// Define Model's static methods here (don't know why but Mongoose doc named it "Model")
interface OrderModel extends mongoose.Model<IOrder> {
	countNewOrders(type: string): Promise<number>;
	revenueAndProfitStatistics(
		type: string,
		startDate: any,
		endDate: any
	): Promise<any[]>;
	bookSaleStatistics(
		type: string,
		startDate: any,
		endDate: any,
		sort: string
	): Promise<any[]>;
}

const orderSchema = new mongoose.Schema<IOrder, OrderModel>(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Hãy nhập id người dùng"],
		},
		orderDate: {
			type: Date,
			default: Date.now(),
		},
		// Statuses for order of a book store
		// 1. pending: order is being paid
		// 2. paid: order is paid
		// 3. shipping: order is shipping
		// 3. completed: order is completed
		// 4. canceled: order is canceled
		status: {
			type: String,
			enum: ["pending", "paid", "shipping", "completed", "cancelled"],
			default: "pending",
		},
		description: String,
		totalPrice: {
			type: Number,
		},
		finalPrice: {
			type: Number,
		},
		orderDetails: [
			{
				book: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Book",
					required: [true, "Hãy nhập id sản phẩm"],
				},
				quantity: {
					type: Number,
					required: [true, "Hãy nhập số lượng sản phẩm"],
				},
				price: {
					type: Number,
					required: [true, "Hãy nhập giá sản phẩm"],
				},
			},
		],
	},
	{
		toJSON: { virtuals: true, versionKey: false },
	}
);

orderSchema.index({ user: 1 });
orderSchema.index({ orderDate: 1 });

orderSchema.pre("save", function (next) {
	if (this.isNew || this.isModified("orderDetails")) {
		this.totalPrice = this.orderDetails.reduce(
			(acc, cur) => acc + cur.price * cur.quantity,
			0
		);
		this.finalPrice = this.totalPrice;
	}

	next();
});

orderSchema.statics.countNewOrders = async function (type) {
	let startDate, endDate;
	switch (type) {
		case "week":
			startDate = new Date();
			startDate.setDate(startDate.getDate() - 7);
			endDate = new Date();
			break;
		case "month":
			startDate = new Date();
			startDate.setDate(startDate.getDate() - 30);
			endDate = new Date();
			break;

		default:
			throw new AppError(
				400,
				"INVALID_ARGUMENTS",
				`Không hỗ trợ thống kê theo kiểu ${type}`,
				{
					type: `Không hỗ trợ thống kê theo kiểu ${type}`,
				}
			);
	}

	return this.countDocuments({
		orderDate: {
			$gte: startDate,
			$lt: endDate,
		},
		$and: [{ status: { $ne: "cancelled" } }, { status: { $ne: "pending" } }],
	});
};

orderSchema.statics.revenueAndProfitStatistics = async function (
	type,
	startDate,
	endDate
) {
	let groupByDateType;
	if (type !== "year") {
		groupByDateType = {
			$dateToString: {
				format: "%Y-%m-%d",
				date: "$orderDate",
			},
		};
	} else {
		groupByDateType = {
			$dateToString: {
				format: "%Y-%m",
				date: "$orderDate",
			},
		};
	}
	switch (type) {
		case "today":
			startDate = new Date();
			startDate.setHours(0, 0, 0, 0);
			endDate = new Date();
			endDate.setHours(23, 59, 59, 999);
			break;
		case "dateRange":
			startDate = new Date(startDate);
			endDate = new Date(endDate);
			break;
		case "week":
			startDate = new Date();
			startDate.setDate(startDate.getDate() - 7);
			endDate = new Date();
			break;
		case "month":
			startDate = new Date();
			startDate.setDate(startDate.getDate() - 30);
			endDate = new Date();
			break;

		case "year":
			startDate = new Date();
			startDate.setMonth(startDate.getMonth() - 12);
			endDate = new Date();
			break;
	}

	const stats = await this.aggregate([
		{
			$match: {
				orderDate: {
					$gte: startDate,
					$lt: endDate,
				},
				$and: [
					{ status: { $ne: "cancelled" } },
					{ status: { $ne: "pending" } },
				],
			},
		},
		{
			$lookup: {
				from: "books",
				localField: "orderDetails.book",
				foreignField: "_id",
				as: "books",
			},
		},
		{
			$addFields: {
				date: groupByDateType,
				totalPurchasePrice: {
					$sum: "$books.purchasePrice",
				},
			},
		},
		{
			$group: {
				_id: "$date",
				revenue: {
					$sum: "$finalPrice",
				},
				profit: {
					$sum: {
						$subtract: ["$finalPrice", "$totalPurchasePrice"],
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				date: "$_id",
				revenue: 1,
				profit: 1,
			},
		},
		{
			$sort: { date: 1 },
		},
	]);

	let statsResult = addMissingDates(stats, startDate, endDate, [
		"revenue",
		"profit",
	]);

	return statsResult;
};

orderSchema.statics.bookSaleStatistics = async function (
	type,
	startDate,
	endDate,
	sort
) {
	switch (type) {
		case "today":
			startDate = new Date();
			startDate.setHours(0, 0, 0, 0);
			endDate = new Date();
			endDate.setHours(23, 59, 59, 999);
			break;
		case "dateRange":
			startDate = new Date(startDate);
			endDate = new Date(endDate);
			break;
		case "week":
			startDate = new Date();
			startDate.setDate(startDate.getDate() - 7);
			endDate = new Date();
			break;
		case "month":
			startDate = new Date();
			startDate.setDate(startDate.getDate() - 30);
			endDate = new Date();
			break;

		case "year":
			startDate = new Date();
			startDate.setMonth(startDate.getMonth() - 12);
			endDate = new Date();
			break;
	}

	let sortOptions = {};

	let sortField = 'soldQuantity'; 
	let sortOrder = -1; 

	if (sort) {
		const sortPrefix = sort[0];
		if (sortPrefix === '-' || sortPrefix === '+') {
			sortField = sort.substring(1);
			sortOrder = sortPrefix === '-' ? -1 : 1;
		}
	}
	
	
	sortOptions[sortField] = sortOrder;

	const stats = await this.aggregate([
		{
			$match: {
				orderDate: {
					$gte: startDate,
					$lt: endDate,
				},
				$and: [
					{ status: { $ne: "cancelled" } },
					{ status: { $ne: "pending" } },
				],
			},
		},
		{
			$unwind: "$orderDetails",
		},
		{
			$group: {
				_id: "$orderDetails.book",
				soldQuantity: {
					$sum: "$orderDetails.quantity",
				},
			},
		},
		{
			$lookup: {
				from: "books",
				localField: "_id",
				foreignField: "_id",
				as: "book",
			},
		},
		{
			$unwind: "$book",
		},
		{
			$project: {
				_id: 0,
				id: "$book._id",
				name: "$book.name",
				image: "$book.image",
				soldQuantity: "$soldQuantity",
			},
		},
		{
			$sort: sortOptions,
		},
	]);

	const statsResult = await addMissingBooks(stats, startDate, endDate, [
		"soldQuantity",
	], sortOptions);

	return stats;
};

orderSchema.plugin(mongooseLeanVirtuals);

const Order = mongoose.model<IOrder, OrderModel>("Order", orderSchema);

export default Order;
