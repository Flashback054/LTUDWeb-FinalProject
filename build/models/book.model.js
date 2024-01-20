"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_lean_virtuals_1 = __importDefault(require("mongoose-lean-virtuals"));
var bookSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Hãy nhập tên sản phẩm"],
        unique: true,
    },
    image: {
        type: String,
    },
    imagePublicId: {
        type: String,
    },
    purchasePrice: {
        type: Number,
        required: [true, "Hãy nhập giá nhập sản phẩm"],
    },
    sellingPrice: {
        type: Number,
        required: [true, "Hãy nhập giá bán sản phẩm"],
    },
    author: {
        type: String,
        required: [true, "Hãy nhập tên tác giả"],
    },
    publishedYear: {
        type: Number,
        required: [true, "Hãy nhập năm xuất bản"],
        min: [0, "Năm xuất bản không hợp lệ"],
        validate: {
            validator: function (year) {
                return Number.isInteger(year);
            },
            message: "Năm xuất bản không hợp lệ",
        },
    },
    ratingsAverage: {
        type: Number,
        default: 5,
    },
    quantity: {
        type: Number,
        required: [true, "Hãy nhập số lượng sản phẩm"],
    },
    description: String,
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        // Set default category to 658be841b3eba6ae4c0e382b (id of category "Khác")
        default: "658be841b3eba6ae4c0e382b",
    },
}, {
    toJSON: { virtuals: true, versionKey: false },
});
bookSchema.index({ name: 1 }, { unique: true });
bookSchema.plugin(mongoose_lean_virtuals_1.default);
var Book = mongoose_1.default.model("Book", bookSchema);
exports.default = Book;
//# sourceMappingURL=book.model.js.map