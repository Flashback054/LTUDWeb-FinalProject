import mongoose from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import { ObjectId, Types } from "mongoose";

interface IPayment {
	id: Types.ObjectId;
	order: Types.ObjectId;
	user: Types.ObjectId;
	coupon: Types.ObjectId;
	status: string;
	paymentError: string;
	paymentDate: Date;
	description: string;
	totalPrice: number;
	discountPrice: number;
	finalPrice: number;
}

const paymentSchema = new mongoose.Schema<IPayment>(
	{
		order: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Order",
			required: [true, "Hãy nhập id đơn hàng"],
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Hãy nhập id người dùng"],
		},
		coupon: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Coupon",
		},
		status: {
			type: String,
			enum: ["pending", "success", "failed"],
			default: "pending",
		},
		paymentError: String,
		paymentDate: {
			type: Date,
			default: Date.now(),
		},
		description: String,
		totalPrice: {
			type: Number,
			required: [true, "Hãy nhập tổng tiền"],
		},
		discountPrice: {
			type: Number,
			default: 0,
		},
		finalPrice: {
			type: Number,
		},
	},
	{
		toJSON: { virtuals: true, versionKey: false },
	}
);

paymentSchema.plugin(mongooseLeanVirtuals);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;
