"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var AppError_1 = __importDefault(require("./AppError"));
var multerStorage = multer_1.default.memoryStorage();
// Check if uploaded file is image
var multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    }
    else {
        cb(new AppError_1.default(400, "INVALID_ARGUMENTS", "Vui lòng upload file có định dạng ảnh"), false);
    }
};
exports.upload = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
});
//# sourceMappingURL=multerUpload.js.map