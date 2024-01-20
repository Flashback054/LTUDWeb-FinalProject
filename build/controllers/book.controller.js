"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getBook = exports.getAllBooks = exports.createBook = exports.uploadBookImage = void 0;
var book_model_1 = __importDefault(require("../models/book.model"));
var controller_factory_1 = __importDefault(require("./controller.factory"));
var cloudinary_config_1 = __importDefault(require("../configs/cloudinary.config"));
var CloudinaryBookStorage = new cloudinary_config_1.default(book_model_1.default);
exports.uploadBookImage = CloudinaryBookStorage.upload.single("image");
exports.createBook = controller_factory_1.default.createOne(book_model_1.default, {
    populate: {
        path: "category",
        select: "name image",
    },
});
exports.getAllBooks = controller_factory_1.default.getAll(book_model_1.default, {
    populate: {
        path: "category",
        select: "name image",
    },
});
exports.getBook = controller_factory_1.default.getOne(book_model_1.default, {
    populate: {
        path: "category",
        select: "name image",
    },
});
exports.updateBook = controller_factory_1.default.updateOne(book_model_1.default, {
    populate: {
        path: "category",
        select: "name image",
    },
});
exports.deleteBook = controller_factory_1.default.deleteOne(book_model_1.default);
//# sourceMappingURL=book.controller.js.map