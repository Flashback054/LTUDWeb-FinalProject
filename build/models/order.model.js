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
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_lean_virtuals_1 = __importDefault(require("mongoose-lean-virtuals"));
var statisticsHelper_1 = require("../utils/statisticsHelper");
var AppError_1 = __importDefault(require("../utils/AppError"));
var orderSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Hãy nhập id người dùng"],
    },
    orderDate: {
        type: Date,
        default: Date.now(),
    },
    // Statuses for order of a book store
    // 1. pending: order is being paid
    // 2. paid: order is paid
    // 3. shipping: order is shipping
    // 3. completed: order is completed
    // 4. canceled: order is canceled
    status: {
        type: String,
        enum: ["pending", "paid", "shipping", "completed", "cancelled"],
        default: "pending",
    },
    description: String,
    totalPrice: {
        type: Number,
    },
    finalPrice: {
        type: Number,
    },
    orderDetails: [
        {
            book: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Book",
                required: [true, "Hãy nhập id sản phẩm"],
            },
            quantity: {
                type: Number,
                required: [true, "Hãy nhập số lượng sản phẩm"],
            },
            price: {
                type: Number,
                required: [true, "Hãy nhập giá sản phẩm"],
            },
        },
    ],
}, {
    toJSON: { virtuals: true, versionKey: false },
});
orderSchema.index({ user: 1 });
orderSchema.index({ orderDate: 1 });
orderSchema.pre("save", function (next) {
    if (this.isNew || this.isModified("orderDetails")) {
        this.totalPrice = this.orderDetails.reduce(function (acc, cur) { return acc + cur.price * cur.quantity; }, 0);
        this.finalPrice = this.totalPrice;
    }
    next();
});
orderSchema.statics.countNewOrders = function (type) {
    return __awaiter(this, void 0, void 0, function () {
        var startDate, endDate;
        return __generator(this, function (_a) {
            switch (type) {
                case "week":
                    startDate = new Date();
                    startDate.setDate(startDate.getDate() - 7);
                    endDate = new Date();
                    break;
                case "month":
                    startDate = new Date();
                    startDate.setDate(startDate.getDate() - 30);
                    endDate = new Date();
                    break;
                default:
                    throw new AppError_1.default(400, "INVALID_ARGUMENTS", "Kh\u00F4ng h\u1ED7 tr\u1EE3 th\u1ED1ng k\u00EA theo ki\u1EC3u ".concat(type), {
                        type: "Kh\u00F4ng h\u1ED7 tr\u1EE3 th\u1ED1ng k\u00EA theo ki\u1EC3u ".concat(type),
                    });
            }
            return [2 /*return*/, this.countDocuments({
                    orderDate: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                    $and: [{ status: { $ne: "cancelled" } }, { status: { $ne: "pending" } }],
                })];
        });
    });
};
orderSchema.statics.revenueAndProfitStatistics = function (type, startDate, endDate) {
    return __awaiter(this, void 0, void 0, function () {
        var groupByDateType, stats, statsResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (type !== "year") {
                        groupByDateType = {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$orderDate",
                            },
                        };
                    }
                    else {
                        groupByDateType = {
                            $dateToString: {
                                format: "%Y-%m",
                                date: "$orderDate",
                            },
                        };
                    }
                    switch (type) {
                        case "today":
                            startDate = new Date();
                            startDate.setHours(0, 0, 0, 0);
                            endDate = new Date();
                            endDate.setHours(23, 59, 59, 999);
                            break;
                        case "dateRange":
                            startDate = new Date(startDate);
                            endDate = new Date(endDate);
                            break;
                        case "week":
                            startDate = new Date();
                            startDate.setDate(startDate.getDate() - 7);
                            endDate = new Date();
                            break;
                        case "month":
                            startDate = new Date();
                            startDate.setDate(startDate.getDate() - 30);
                            endDate = new Date();
                            break;
                        case "year":
                            startDate = new Date();
                            startDate.setMonth(startDate.getMonth() - 12);
                            endDate = new Date();
                            break;
                    }
                    return [4 /*yield*/, this.aggregate([
                            {
                                $match: {
                                    orderDate: {
                                        $gte: startDate,
                                        $lt: endDate,
                                    },
                                    $and: [
                                        { status: { $ne: "cancelled" } },
                                        { status: { $ne: "pending" } },
                                    ],
                                },
                            },
                            {
                                $lookup: {
                                    from: "books",
                                    localField: "orderDetails.book",
                                    foreignField: "_id",
                                    as: "books",
                                },
                            },
                            {
                                $addFields: {
                                    date: groupByDateType,
                                    totalPurchasePrice: {
                                        $sum: "$books.purchasePrice",
                                    },
                                },
                            },
                            {
                                $group: {
                                    _id: "$date",
                                    revenue: {
                                        $sum: "$finalPrice",
                                    },
                                    profit: {
                                        $sum: {
                                            $subtract: ["$finalPrice", "$totalPurchasePrice"],
                                        },
                                    },
                                },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    date: "$_id",
                                    revenue: 1,
                                    profit: 1,
                                },
                            },
                            {
                                $sort: { date: 1 },
                            },
                        ])];
                case 1:
                    stats = _a.sent();
                    statsResult = (0, statisticsHelper_1.addMissingDates)(stats, startDate, endDate, [
                        "revenue",
                        "profit",
                    ]);
                    return [2 /*return*/, statsResult];
            }
        });
    });
};
orderSchema.statics.bookSaleStatistics = function (type, startDate, endDate) {
    return __awaiter(this, void 0, void 0, function () {
        var stats, statsResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    switch (type) {
                        case "today":
                            startDate = new Date();
                            startDate.setHours(0, 0, 0, 0);
                            endDate = new Date();
                            endDate.setHours(23, 59, 59, 999);
                            break;
                        case "dateRange":
                            startDate = new Date(startDate);
                            endDate = new Date(endDate);
                            break;
                        case "week":
                            startDate = new Date();
                            startDate.setDate(startDate.getDate() - 7);
                            endDate = new Date();
                            break;
                        case "month":
                            startDate = new Date();
                            startDate.setDate(startDate.getDate() - 30);
                            endDate = new Date();
                            break;
                        case "year":
                            startDate = new Date();
                            startDate.setMonth(startDate.getMonth() - 12);
                            endDate = new Date();
                            break;
                    }
                    return [4 /*yield*/, this.aggregate([
                            {
                                $match: {
                                    orderDate: {
                                        $gte: startDate,
                                        $lt: endDate,
                                    },
                                    $and: [
                                        { status: { $ne: "cancelled" } },
                                        { status: { $ne: "pending" } },
                                    ],
                                },
                            },
                            {
                                $unwind: "$orderDetails",
                            },
                            {
                                $group: {
                                    _id: "$orderDetails.book",
                                    soldQuantity: {
                                        $sum: "$orderDetails.quantity",
                                    },
                                },
                            },
                            {
                                $lookup: {
                                    from: "books",
                                    localField: "_id",
                                    foreignField: "_id",
                                    as: "book",
                                },
                            },
                            {
                                $unwind: "$book",
                            },
                            {
                                $project: {
                                    _id: 0,
                                    id: "$book._id",
                                    name: "$book.name",
                                    image: "$book.image",
                                    soldQuantity: "$soldQuantity",
                                },
                            },
                            {
                                $sort: {
                                    quantity: -1,
                                },
                            },
                        ])];
                case 1:
                    stats = _a.sent();
                    return [4 /*yield*/, (0, statisticsHelper_1.addMissingBooks)(stats, startDate, endDate, [
                            "soldQuantity",
                        ])];
                case 2:
                    statsResult = _a.sent();
                    return [2 /*return*/, stats];
            }
        });
    });
};
orderSchema.plugin(mongoose_lean_virtuals_1.default);
var Order = mongoose_1.default.model("Order", orderSchema);
exports.default = Order;
//# sourceMappingURL=order.model.js.map