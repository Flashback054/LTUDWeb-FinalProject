import mongoose from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

interface ICoupon {
	code: string;
	name: string;
	description: string;
	createdAt: Date;
	startDate: Date;
	endDate: Date;
	discount_percent: number;
	maxDiscount: number;
	minPrice: number;
}

const couponSchema = new mongoose.Schema<ICoupon>(
	{
		code: {
			type: String,
			required: [true, "Hãy nhập mã giảm giá"],
			unique: true,
		},
		name: {
			type: String,
			required: [true, "Hãy nhập tên giảm giá"],
		},
		description: String,
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		startDate: {
			type: Date,
			required: [true, "Hãy nhập ngày bắt đầu"],
		},
		endDate: Date,
		discount_percent: {
			type: Number,
			required: [true, "Hãy nhập phần trăm giảm giá"],
		},
		maxDiscount: {
			type: Number,
			required: [true, "Hãy nhập số tiền giảm tối đa"],
		},
		minPrice: {
			type: Number,
			required: [true, "Hãy nhập số tiền tối thiểu"],
		},
	},
	{
		toJSON: { virtuals: true, versionKey: false },
	}
);

couponSchema.index({ code: 1 });

couponSchema.plugin(mongooseLeanVirtuals);

const Coupon = mongoose.model<ICoupon>("Coupon", couponSchema);

export default Coupon;
