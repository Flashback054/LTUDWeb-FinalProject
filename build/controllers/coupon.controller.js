"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.updateCoupon = exports.createCoupon = exports.getCoupon = exports.getAllCoupons = void 0;
var coupon_model_1 = __importDefault(require("../models/coupon.model"));
var controller_factory_1 = __importDefault(require("./controller.factory"));
exports.getAllCoupons = controller_factory_1.default.getAll(coupon_model_1.default);
exports.getCoupon = controller_factory_1.default.getOne(coupon_model_1.default);
exports.createCoupon = controller_factory_1.default.createOne(coupon_model_1.default);
exports.updateCoupon = controller_factory_1.default.updateOne(coupon_model_1.default);
exports.deleteCoupon = controller_factory_1.default.deleteOne(coupon_model_1.default);
//# sourceMappingURL=coupon.controller.js.map