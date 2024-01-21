import mongoose from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import { ObjectId, Types } from "mongoose";

interface IPaymentAccount {
	id: Types.ObjectId;
	user: Types.ObjectId;
	balance: number;
}

const paymentAccountSchema = new mongoose.Schema<IPaymentAccount>(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Hãy nhập id người dùng"],
		},
		balance: {
			type: Number,
			default: 0,
		},
	},
	{
		toJSON: { virtuals: true, versionKey: false },
	}
);

paymentAccountSchema.index({ user: 1 });
paymentAccountSchema.plugin(mongooseLeanVirtuals);

const PaymentAccount = mongoose.model<IPaymentAccount>(
	"Payment",
	paymentAccountSchema
);

export default PaymentAccount;
