"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategory = exports.getAllCategories = exports.uploadCategoryImage = void 0;
var category_model_1 = __importDefault(require("../models/category.model"));
var controller_factory_1 = __importDefault(require("./controller.factory"));
var CloudinaryStorageFactory = require("../configs/cloudinary.config");
var CloudinaryCategoryStorage = new CloudinaryStorageFactory(category_model_1.default);
exports.uploadCategoryImage = CloudinaryCategoryStorage.upload.single("image");
exports.getAllCategories = controller_factory_1.default.getAll(category_model_1.default);
exports.getCategory = controller_factory_1.default.getOne(category_model_1.default);
exports.createCategory = controller_factory_1.default.createOne(category_model_1.default);
exports.updateCategory = controller_factory_1.default.updateOne(category_model_1.default);
exports.deleteCategory = controller_factory_1.default.deleteOne(category_model_1.default);
//# sourceMappingURL=category.controller.js.map