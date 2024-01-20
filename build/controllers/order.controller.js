"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payOrder = exports.checkGetAllOrdersPermission = exports.checkOrderStatus = exports.checkOrderOwnership = exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.getOrder = exports.getAllOrders = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var payment_model_1 = __importDefault(require("../models/payment.model"));
var book_model_1 = __importDefault(require("../models/book.model"));
var order_model_1 = __importDefault(require("../models/order.model"));
var controller_factory_1 = __importDefault(require("./controller.factory"));
var AppError_1 = __importDefault(require("../utils/AppError"));
exports.getAllOrders = controller_factory_1.default.getAll(order_model_1.default, {
    populate: [
        {
            path: "orderDetails.book",
            select: "name image",
        },
        {
            path: "user",
            select: "name email",
        },
    ],
    allowNestedQueries: ["userId"],
});
exports.getOrder = controller_factory_1.default.getOne(order_model_1.default, {
    populate: [
        {
            path: "orderDetails.book",
            select: "name image",
        },
        {
            path: "user",
            select: "name email",
        },
    ],
});
var createOrder = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var orderDetails, userId, order, session, _i, orderDetails_1, item, updatedBook, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orderDetails = req.body.orderDetails;
                userId = req.body.user || req.user.id;
                return [4 /*yield*/, mongoose_1.default.startSession()];
            case 1:
                session = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 9, , 11]);
                session.startTransaction();
                _i = 0, orderDetails_1 = orderDetails;
                _a.label = 3;
            case 3:
                if (!(_i < orderDetails_1.length)) return [3 /*break*/, 6];
                item = orderDetails_1[_i];
                return [4 /*yield*/, book_model_1.default.findOneAndUpdate({ _id: item.book, quantity: { $gte: item.quantity } }, { $inc: { quantity: -item.quantity } }, { new: true, session: session })];
            case 4:
                updatedBook = _a.sent();
                if (!updatedBook) {
                    throw new AppError_1.default(400, "NOT_ENOUGH_QUANTITY", "S\u1ED1 l\u01B0\u1EE3ng ".concat(item.name, " kh\u00F4ng \u0111\u1EE7 \u0111\u1EC3 \u0111\u1EB7t h\u00E0ng"), {
                        book: "S\u1ED1 l\u01B0\u1EE3ng ".concat(item.name, " kh\u00F4ng \u0111\u1EE7 \u0111\u1EC3 \u0111\u1EB7t h\u00E0ng"),
                    });
                }
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, order_model_1.default.create({
                    user: userId,
                    orderDetails: orderDetails,
                })];
            case 7:
                // Create order
                order = _a.sent();
                return [4 /*yield*/, session.commitTransaction()];
            case 8:
                _a.sent();
                session.endSession();
                return [3 /*break*/, 11];
            case 9:
                error_1 = _a.sent();
                return [4 /*yield*/, session.abortTransaction()];
            case 10:
                _a.sent();
                session.endSession();
                throw error_1;
            case 11: 
            // Populate order.orderDetails.book and order.user
            return [4 /*yield*/, order.populate([
                    {
                        path: "orderDetails.book",
                        select: "name image",
                    },
                    {
                        path: "user",
                        select: "name email",
                    },
                ])];
            case 12:
                // Populate order.orderDetails.book and order.user
                _a.sent();
                // Send response
                res.status(201).json({
                    data: order,
                });
                return [2 /*return*/];
        }
    });
}); };
exports.createOrder = createOrder;
var updateOrder = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var order, session, _i, _a, item, refundedBook, payment, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, order_model_1.default.findById(req.params.id)];
            case 1:
                order = _b.sent();
                if (!order) {
                    throw new AppError_1.default(404, "NOT_FOUND", "Kh\u00F4ng t\u00ECm th\u1EA5y order v\u1EDBi ID ".concat(req.params.id), {
                        id: req.params.id,
                    });
                }
                if (!(req.body.status === "cancelled")) return [3 /*break*/, 14];
                return [4 /*yield*/, mongoose_1.default.startSession()];
            case 2:
                session = _b.sent();
                session.startTransaction();
                _b.label = 3;
            case 3:
                _b.trys.push([3, 11, , 13]);
                _i = 0, _a = order.orderDetails;
                _b.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                item = _a[_i];
                return [4 /*yield*/, book_model_1.default.findOneAndUpdate({ _id: item.book }, { $inc: { quantity: item.quantity } }, { new: true, runValidators: true, session: session })];
            case 5:
                refundedBook = _b.sent();
                _b.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7: return [4 /*yield*/, payment_model_1.default.findOneAndUpdate({ order: order.id }, { status: "failed", paymentError: "Đơn hàng đã bị huỷ" }, { new: true, runValidators: true, session: session })];
            case 8:
                payment = _b.sent();
                // TODO: Use VNPAY to refund money to user
                order.status = "cancelled";
                return [4 /*yield*/, order.save()];
            case 9:
                _b.sent();
                return [4 /*yield*/, session.commitTransaction()];
            case 10:
                _b.sent();
                session.endSession();
                return [3 /*break*/, 13];
            case 11:
                error_2 = _b.sent();
                return [4 /*yield*/, session.abortTransaction()];
            case 12:
                _b.sent();
                session.endSession();
                throw new AppError_1.default(500, "INTERNAL_SERVER_ERROR", "Có lỗi xảy ra trong quá trình huỷ đơn hàng");
            case 13: return [3 /*break*/, 16];
            case 14: return [4 /*yield*/, order_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                    runValidators: true,
                })];
            case 15:
                order = _b.sent();
                _b.label = 16;
            case 16: 
            // Populate order with orderDetails.book and user
            return [4 /*yield*/, order.populate([
                    {
                        path: "orderDetails.book",
                        select: "name image",
                        options: { lean: true },
                    },
                    {
                        path: "user",
                        select: "name email",
                        options: { lean: true },
                    },
                ])];
            case 17:
                // Populate order with orderDetails.book and user
                _b.sent();
                res.status(200).json({
                    data: order,
                });
                return [2 /*return*/];
        }
    });
}); };
exports.updateOrder = updateOrder;
var deleteOrder = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var order, session, _i, _a, item, refundedBook, payment, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, order_model_1.default.findById(req.params.id)];
            case 1:
                order = _b.sent();
                if (!order) {
                    throw new AppError_1.default(404, "NOT_FOUND", "Kh\u00F4ng t\u00ECm th\u1EA5y order v\u1EDBi ID ".concat(req.params.id), {
                        id: req.params.id,
                    });
                }
                if (!(order.status !== "cancelled")) return [3 /*break*/, 14];
                return [4 /*yield*/, mongoose_1.default.startSession()];
            case 2:
                session = _b.sent();
                session.startTransaction();
                _b.label = 3;
            case 3:
                _b.trys.push([3, 11, , 13]);
                _i = 0, _a = order.orderDetails;
                _b.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                item = _a[_i];
                return [4 /*yield*/, book_model_1.default.findOneAndUpdate({ _id: item.book }, { $inc: { quantity: item.quantity } }, { new: true, runValidators: true, session: session })];
            case 5:
                refundedBook = _b.sent();
                _b.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7: return [4 /*yield*/, payment_model_1.default.findOneAndDelete({ order: order.id }, { session: session })];
            case 8:
                payment = _b.sent();
                // 4) Delete Order
                return [4 /*yield*/, order_model_1.default.findByIdAndDelete(order.id, { session: session })];
            case 9:
                // 4) Delete Order
                _b.sent();
                return [4 /*yield*/, session.commitTransaction()];
            case 10:
                _b.sent();
                session.endSession();
                return [3 /*break*/, 13];
            case 11:
                error_3 = _b.sent();
                return [4 /*yield*/, session.abortTransaction()];
            case 12:
                _b.sent();
                session.endSession();
                throw new AppError_1.default(500, "INTERNAL_SERVER_ERROR", "Có lỗi xảy ra trong quá trình huỷ đơn hàng");
            case 13: return [3 /*break*/, 16];
            case 14: return [4 /*yield*/, order_model_1.default.findByIdAndDelete(order.id)];
            case 15:
                _b.sent();
                _b.label = 16;
            case 16:
                res.status(204).json({
                    data: null,
                });
                return [2 /*return*/];
        }
    });
}); };
exports.deleteOrder = deleteOrder;
// Middleware
var checkOrderOwnership = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var order, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (req.user.role === "admin") {
                    return [2 /*return*/, next()];
                }
                _a = req.order;
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, order_model_1.default.findById(req.params.id).lean({ virtuals: true })];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                order = _a;
                if (!order) {
                    throw new AppError_1.default(404, "NOT_FOUND", "Kh\u00F4ng t\u00ECm th\u1EA5y order v\u1EDBi ID ".concat(req.params.id), {
                        id: req.params.id,
                    });
                }
                if (!order.user || order.user.toString() !== req.user.id.toString()) {
                    throw new AppError_1.default(403, "FORBIDDEN", "Bạn không có quyền truy cập vào order của người khác");
                }
                req.order = order;
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.checkOrderOwnership = checkOrderOwnership;
var checkOrderStatus = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var order, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (req.user.role === "admin") {
                    return [2 /*return*/, next()];
                }
                _a = req.order;
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, order_model_1.default.findById(req.params.id).lean({ virtuals: true })];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                order = _a;
                if (!order) {
                    throw new AppError_1.default(404, "NOT_FOUND", "Kh\u00F4ng t\u00ECm th\u1EA5y order v\u1EDBi ID ".concat(req.params.id), {
                        id: req.params.id,
                    });
                }
                if (order.status === "completed") {
                    throw new AppError_1.default(403, "FORBIDDEN", "Bạn không thể thay đổi order đã hoàn thành");
                }
                if (order.status === "cancelled") {
                    throw new AppError_1.default(403, "FORBIDDEN", "Bạn không thể thay đổi order đã hủy");
                }
                if (order.status === "shipping") {
                    throw new AppError_1.default(403, "FORBIDDEN", "Bạn không thể thay đổi order đang giao hàng");
                }
                if (order.status === "paid") {
                    throw new AppError_1.default(403, "FORBIDDEN", "Bạn không thể thay đổi order đã thanh toán");
                }
                req.order = order;
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.checkOrderStatus = checkOrderStatus;
var checkGetAllOrdersPermission = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    return __generator(this, function (_a) {
        if (req.user.role === "admin") {
            return [2 /*return*/, next()];
        }
        userId = req.user.id;
        if (!req.params.userId ||
            (req.params.userId && req.params.userId !== userId.toString())) {
            throw new AppError_1.default(403, "FORBIDDEN", "Bạn không có quyền truy cập vào order của người khác");
        }
        next();
        return [2 /*return*/];
    });
}); };
exports.checkGetAllOrdersPermission = checkGetAllOrdersPermission;
var payOrder = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var order, payment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, order_model_1.default.findById(req.params.id)];
            case 1:
                order = _a.sent();
                if (!order) {
                    throw new AppError_1.default(404, "NOT_FOUND", "Kh\u00F4ng t\u00ECm th\u1EA5y order v\u1EDBi ID ".concat(req.params.id), {
                        id: req.params.id,
                    });
                }
                if (order.status === "completed" ||
                    order.status === "cancelled" ||
                    order.status === "shipping" ||
                    order.status === "paid") {
                    throw new AppError_1.default(403, "FORBIDDEN", "Bạn chỉ có thể thanh toán order đang chờ thanh toán");
                }
                return [4 /*yield*/, payment_model_1.default.create({
                        order: order.id,
                        status: "success",
                        paymentDate: Date.now(),
                        description: "Thanh to\u00E1n \u0111\u01A1n h\u00E0ng ".concat(order.id),
                        totalPrice: order.totalPrice,
                        finalPrice: order.finalPrice,
                    })];
            case 2:
                payment = _a.sent();
                // Update order status to "paid"
                order.status = "paid";
                return [4 /*yield*/, order.save()];
            case 3:
                _a.sent();
                // Populate order with orderDetails.book and user
                return [4 /*yield*/, order.populate([
                        {
                            path: "orderDetails.book",
                            select: "name image",
                            options: { lean: true },
                        },
                        {
                            path: "user",
                            select: "name email",
                            options: { lean: true },
                        },
                    ])];
            case 4:
                // Populate order with orderDetails.book and user
                _a.sent();
                // Send response
                res.status(200).json({
                    data: order,
                });
                return [2 /*return*/];
        }
    });
}); };
exports.payOrder = payOrder;
//# sourceMappingURL=order.controller.js.map