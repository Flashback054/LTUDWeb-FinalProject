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
exports.catchReview = exports.checkReviewBelongsToUser = exports.setBookAndUserOnBody = exports.deleteReview = exports.updateReview = exports.createReview = exports.getReview = exports.getAllReviews = void 0;
var review_model_1 = __importDefault(require("../models/review.model"));
var controller_factory_1 = __importDefault(require("./controller.factory"));
var AppError_1 = __importDefault(require("../utils/AppError"));
exports.getAllReviews = controller_factory_1.default.getAll(review_model_1.default, {
    populate: [
        {
            path: "user",
            select: "name email",
        },
        {
            path: "book",
            select: "name",
        },
    ],
    allowNestedQueries: ["userId"],
});
exports.getReview = controller_factory_1.default.getOne(review_model_1.default, {
    populate: [
        {
            path: "user",
            select: "name email",
        },
        {
            path: "book",
            select: "name",
        },
    ],
});
exports.createReview = controller_factory_1.default.createOne(review_model_1.default, {
    populate: [
        {
            path: "user",
            select: "name email",
        },
        {
            path: "book",
            select: "name",
        },
    ],
});
exports.updateReview = controller_factory_1.default.updateOne(review_model_1.default, {
    populate: [
        {
            path: "user",
            select: "name email",
        },
        {
            path: "book",
            select: "name",
        },
    ],
});
exports.deleteReview = controller_factory_1.default.deleteOne(review_model_1.default);
var setBookAndUserOnBody = function (req, res, next) {
    var _a, _b;
    if (!req.body.book)
        req.body.book = (_a = req.params) === null || _a === void 0 ? void 0 : _a.book;
    if (!req.body.user)
        req.body.user = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    next();
};
exports.setBookAndUserOnBody = setBookAndUserOnBody;
var checkReviewBelongsToUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var review;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "admin")
                    return [2 /*return*/, next()];
                return [4 /*yield*/, review_model_1.default.findById(req.params.id).lean({ virtuals: true })];
            case 1:
                review = _b.sent();
                if (!review) {
                    throw new AppError_1.default(404, "NOT_FOUND", "Kh\u00F4ng t\u00ECm th\u1EA5y review v\u1EDBi ID ".concat(req.params.id), {
                        id: req.params.id,
                    });
                }
                if (review.user.toString() !== req.user.id.toString()) {
                    throw new AppError_1.default(403, "FORBIDDEN", "Bạn không được sửa, xoá đánh giá của người khác", {
                        id: req.params.id,
                    });
                }
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.checkReviewBelongsToUser = checkReviewBelongsToUser;
var catchReview = function (fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(function (error) {
            if (error.code === 11000) {
                error = new AppError_1.default(400, "BAD_REQUEST", "Bạn đã đánh giá sách này rồi");
            }
            next(error);
        });
    };
};
exports.catchReview = catchReview;
//# sourceMappingURL=review.controller.js.map