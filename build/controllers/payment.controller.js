"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePayment = exports.updatePayment = exports.createPayment = exports.getPayment = exports.getAllPayments = void 0;
var payment_model_1 = __importDefault(require("../models/payment.model"));
var controller_factory_1 = __importDefault(require("./controller.factory"));
exports.getAllPayments = controller_factory_1.default.getAll(payment_model_1.default, {
    allowNestedQueries: ["userId"],
    populate: {
        path: "order",
        populate: {
            path: "user",
            select: "name email",
        },
    },
});
exports.getPayment = controller_factory_1.default.getOne(payment_model_1.default, {
    populate: {
        path: "order",
        populate: {
            path: "user",
            select: "name email",
        },
    },
});
exports.createPayment = controller_factory_1.default.createOne(payment_model_1.default);
exports.updatePayment = controller_factory_1.default.updateOne(payment_model_1.default);
exports.deletePayment = controller_factory_1.default.deleteOne(payment_model_1.default);
//# sourceMappingURL=payment.controller.js.map