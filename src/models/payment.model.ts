import mongoose from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import { ObjectId, Types } from "mongoose";

interface IPayment {
	id: Types.ObjectId;
	order: Types.ObjectId;
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

paymentSchema.index({ order: 1 });
paymentSchema.plugin(mongooseLeanVirtuals);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;
