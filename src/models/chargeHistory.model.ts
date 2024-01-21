import mongoose from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

export interface IChargeHistory {
	id?: mongoose.Types.ObjectId;
	user: mongoose.Types.ObjectId;
	chargeAmount: number;
	chargeDate?: Date;
	chargeStatus: string;
	chargeDescription?: string;
	chargeError?: string;
}

const chargeHistorySchema = new mongoose.Schema<IChargeHistory>(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Giao dịch nạp tiền phải có người dùng"],
		},
		chargeAmount: {
			type: Number,
			required: [true, "Giao dịch nạp tiền phải có số tiền"],
			min: [10000, "Số tiền nạp tối thiểu là 10.000đ"],
		},
		chargeDate: {
			type: Date,
			default: Date.now(),
			required: true,
		},
		chargeStatus: {
			type: String,
			enum: ["pending", "success", "failed"],
			default: "pending",
		},
		chargeDescription: {
			type: String,
			default: "",
		},
		chargeError: String,
	},
	{
		toJSON: { virtuals: true, versionKey: false },
	}
);

chargeHistorySchema.index({ user: 1 });
chargeHistorySchema.plugin(mongooseLeanVirtuals);

const ChargeHistory = mongoose.model<IChargeHistory>(
	"ChargeHistory",
	chargeHistorySchema
);

export default ChargeHistory;
