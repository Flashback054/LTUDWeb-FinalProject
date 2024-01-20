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
Object.defineProperty(exports, "__esModule", { value: true });
var zod = __importStar(require("zod"));
exports.default = zod.object({
    body: zod.object({
        oldPassword: zod
            .string({
            required_error: "Phải nhập mật khẩu cũ",
        })
            .min(8, {
            message: "Mật khẩu phải có ít nhất 8 ký tự",
        }),
        newPassword: zod
            .string({
            required_error: "Phải nhập mật khẩu mới",
        })
            .min(8, {
            message: "Mật khẩu phải có ít nhất 8 ký tự",
        }),
        newPasswordConfirm: zod
            .string({
            required_error: "Phải nhập lại mật khẩu mới",
        })
            .min(8, {
            message: "Mật khẩu phải có ít nhất 8 ký tự",
        }),
    }),
});
//# sourceMappingURL=updatePassword.schema.js.map