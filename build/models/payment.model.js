"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_lean_virtuals_1 = __importDefault(require("mongoose-lean-virtuals"));
var paymentSchema = new mongoose_1.default.Schema({
    order: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Order",
        required: [true, "Hãy nhập id đơn hàng"],
    },
    coupon: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    toJSON: { virtuals: true, versionKey: false },
});
paymentSchema.index({ order: 1 });
paymentSchema.plugin(mongoose_lean_virtuals_1.default);
var Payment = mongoose_1.default.model("Payment", paymentSchema);
exports.default = Payment;
//# sourceMappingURL=payment.model.js.map