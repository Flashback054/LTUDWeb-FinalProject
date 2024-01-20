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
var zod_validation_error_1 = require("zod-validation-error");
var convertToReadableMetadata_1 = __importDefault(require("../utils/convertToReadableMetadata"));
exports.default = (function (err, req, res, next) {
    var _a;
    // Check if erro is zod's error
    if (err instanceof zod.ZodError) {
        var validationErrors = (0, zod_validation_error_1.fromZodError)(err, {
            prefix: "Lỗi dữ liệu",
            includePath: false,
            unionSeparator: ", hoặc",
        });
        return res.status(400).json({
            error: {
                errorMessage: validationErrors.message,
                errorCode: "INVALID_ARGUMENTS",
                errorFields: (0, convertToReadableMetadata_1.default)(validationErrors.details),
            },
        });
    }
    // Check if error is Mongoose ValidationError
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        var validationErrorMessages = Object.values(err.errors).map(function (error) { return error.message; });
        return res.status(400).json({
            error: {
                errorMessage: validationErrorMessages.join("; "),
                errorCode: "INVALID_ARGUMENTS",
                errorFields: err.errors,
            },
        });
    }
    else if (err instanceof mongoose_1.default.Error.CastError) {
        // Check if error is Mongoose CastError
        return res.status(400).json({
            error: {
                errorMessage: "Kh\u00F4ng th\u1EC3 chuy\u1EC3n \u0111\u1ED5i ".concat(err.value, " th\u00E0nh ").concat(err.kind, "}"),
                errorCode: "CAST_ERROR",
                errorFields: (_a = {},
                    _a[err.path] = {
                        value: err.value,
                        kind: err.kind,
                        message: "Kh\u00F4ng th\u1EC3 chuy\u1EC3n \u0111\u1ED5i ".concat(err.value, " th\u00E0nh ").concat(err.kind, "}"),
                    },
                    _a),
            },
        });
    }
    else if (err.code === 11000) {
        // Duplicate key error
        var keys = Object.keys(err.keyValue);
        var values = Object.values(err.keyValue);
        var errorMessage = "Tr\u01B0\u1EDDng (".concat(keys.join(", "), ") (").concat(values.join(", "), ") \u0111\u00E3 t\u1ED3n t\u1EA1i");
        return res.status(400).json({
            error: {
                errorMessage: errorMessage,
                errorCode: "DUPLICATE_KEY",
                errorFields: err.keyValue,
            },
        });
    }
    // Check if error is AppError (custom error)
    if (err.isOperational) {
        return res.status(err.statusCode || 500).json({
            message: err.message,
            reasonPhrase: err.reasonPhrase,
            metadata: err.metadata,
        });
    }
    console.log(err);
    return res.status(500).json({
        message: "Có lỗi xảy ra. Xin hãy liên hệ với admin.",
        reasonPhrase: "INTERNAL_SERVER_ERROR",
    });
});
//# sourceMappingURL=error.controller.js.map