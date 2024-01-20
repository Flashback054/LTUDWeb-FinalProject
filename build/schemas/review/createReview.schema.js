"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var zod = __importStar(require("zod"));
var mongoose_1 = __importDefault(require("mongoose"));
var reviewSchema = zod.object({
    user: zod
        .string({
        required_error: "Phải có id người dùng",
    })
        .superRefine(function (val, ctx) {
        if (!mongoose_1.default.isValidObjectId(val)) {
            ctx.addIssue({
                code: zod.ZodIssueCode.invalid_arguments,
                message: "".concat(val, " kh\u00F4ng ph\u1EA3i l\u00E0 ID ng\u01B0\u1EDDi d\u00F9ng h\u1EE3p l\u1EC7"),
                argumentsError: new zod.ZodError([]), // Add the missing argumentsError property
            });
        }
    })
        .optional(),
    book: zod
        .string({
        required_error: "Phải có id sản phẩm",
    })
        .superRefine(function (val, ctx) {
        if (!mongoose_1.default.isValidObjectId(val)) {
            ctx.addIssue({
                code: zod.ZodIssueCode.invalid_arguments,
                message: "".concat(val, " kh\u00F4ng ph\u1EA3i l\u00E0 ID s\u1EA3n ph\u1EA9m h\u1EE3p l\u1EC7"),
                argumentsError: new zod.ZodError([]), // Add the missing argumentsError property
            });
        }
    }),
    rating: zod
        .number({
        required_error: "Phải có rating là số",
    })
        .int({
        message: "Rating phải là số nguyên",
    })
        .min(1, {
        message: "Rating phải từ 1 đến 5",
    })
        .max(5, {
        message: "Rating phải từ 1 đến 5",
    }),
    review: zod.string().optional(),
    createdAt: zod.date().optional(),
    updatedAt: zod.date().optional(),
});
var createReviewSchema = zod.object({
    body: zod.union([reviewSchema, zod.array(reviewSchema)]),
});
exports.default = createReviewSchema;
//# sourceMappingURL=createReview.schema.js.map