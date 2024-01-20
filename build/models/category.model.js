"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_lean_virtuals_1 = __importDefault(require("mongoose-lean-virtuals"));
var categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Hãy nhập tên danh mục"],
        unique: true,
    },
    description: String,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
categorySchema.plugin(mongoose_lean_virtuals_1.default);
var Category = mongoose_1.default.model("Category", categorySchema);
exports.default = Category;
//# sourceMappingURL=category.model.js.map