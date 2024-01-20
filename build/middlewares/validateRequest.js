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
exports.validateRequestId = exports.validateRequest = void 0;
var zod = __importStar(require("zod"));
var mongoose_1 = __importDefault(require("mongoose"));
function validateRequest(schema) {
    return function (req, res, next) {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (err) {
            next(err);
        }
    };
}
exports.validateRequest = validateRequest;
function validateRequestId(idFieldName) {
    return function (req, res, next) {
        var _a;
        try {
            var schema = zod.object({
                params: zod.object((_a = {},
                    _a[idFieldName] = zod.string().superRefine(function (val, ctx) {
                        if (!mongoose_1.default.isValidObjectId(val)) {
                            ctx.addIssue({
                                code: zod.ZodIssueCode.custom,
                                message: "".concat(val, " kh\u00F4ng ph\u1EA3i l\u00E0 ID h\u1EE3p l\u1EC7"),
                            });
                        }
                    }),
                    _a)),
            });
            schema.parse({
                params: req.params,
            });
            next();
        }
        catch (err) {
            next(err);
        }
    };
}
exports.validateRequestId = validateRequestId;
//# sourceMappingURL=validateRequest.js.map