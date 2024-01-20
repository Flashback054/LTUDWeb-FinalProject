"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_lean_virtuals_1 = __importDefault(require("mongoose-lean-virtuals"));
var couponSchema = new mongoose_1.default.Schema({
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
}, {
    toJSON: { virtuals: true, versionKey: false },
});
couponSchema.index({ code: 1 });
couponSchema.plugin(mongoose_lean_virtuals_1.default);
var Coupon = mongoose_1.default.model("Coupon", couponSchema);
exports.default = Coupon;
//# sourceMappingURL=coupon.model.js.map