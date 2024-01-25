import mongoose from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import { ObjectId, Types } from "mongoose";

interface IPaymentAccount {
	id: Types.ObjectId;
	user: Types.ObjectId;
	balance: number;
	isAdminAccount: boolean;
}

const paymentAccountSchema = new mongoose.Schema<IPaymentAccount>(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Hãy nhập id người dùng"],
			unique: true,
		},
		balance: {
			type: Number,
			default: 0,
		},
		isAdminAccount: {
			type: Boolean,
			default: false,
			select: false,
		},
	},
	{
		toJSON: {
			virtuals: true,
			versionKey: false,
		},
	}
);

paymentAccountSchema.plugin(mongooseLeanVirtuals);

const PaymentAccount = mongoose.model<IPaymentAccount>(
	"PaymentAccount",
	paymentAccountSchema
);

export default PaymentAccount;
