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
var book_model_1 = __importDefault(require("./book.model"));
var reviewSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Hãy nhập id người dùng"],
    },
    book: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Book",
        required: [true, "Hãy nhập id sách"],
    },
    rating: {
        type: Number,
        min: [1, "Đánh giá phải từ 1 đến 5"],
        max: [5, "Đánh giá phải từ 1 đến 5"],
        required: [true, "Hãy nhập đánh giá"],
    },
    review: String,
    image: String,
    imagePublicId: String,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
    },
});
reviewSchema.index({ book: 1, user: 1 }, { unique: true });
reviewSchema.pre("save", function (next) {
    if (!this.isNew) {
        this.updatedAt = new Date();
    }
    next();
});
reviewSchema.statics.calcAverageRatings = function (book) {
    return __awaiter(this, void 0, void 0, function () {
        var stats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.aggregate([
                        {
                            $match: { book: book },
                        },
                        {
                            $group: {
                                _id: "$book",
                                nRating: { $sum: 1 },
                                avgRating: { $avg: "$rating" },
                            },
                        },
                    ])];
                case 1:
                    stats = _a.sent();
                    if (!(stats.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, book_model_1.default.findByIdAndUpdate(book, {
                            ratingsAverage: stats[0].avgRating,
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, book_model_1.default.findByIdAndUpdate(book, {
                        ratingsAverage: 5,
                    })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
};
reviewSchema.post("save", function (doc, next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doc.constructor.calcAverageRatings(doc.book)];
                case 1:
                    _a.sent();
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
reviewSchema.post(/^findOneAnd/, function (doc, next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doc.constructor.calcAverageRatings(doc.book)];
                case 1:
                    _a.sent();
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
reviewSchema.plugin(mongoose_lean_virtuals_1.default);
var Review = mongoose_1.default.model("Review", reviewSchema);
exports.default = Review;
//# sourceMappingURL=review.model.js.map