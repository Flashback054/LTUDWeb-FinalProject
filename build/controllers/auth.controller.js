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
exports.passwordConfirm = exports.restrictTo = exports.protect = exports.updatePassword = exports.logout = exports.login = exports.signup = void 0;
var jwt = __importStar(require("jsonwebtoken"));
var AppError_1 = __importDefault(require("../utils/AppError"));
var generateToken_1 = require("../utils/generateToken");
var user_model_1 = __importDefault(require("../models/user.model"));
var signup = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password, passwordConfirm, existUser, user, _b, accessToken, accessTokenOptions;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, name = _a.name, email = _a.email, password = _a.password, passwordConfirm = _a.passwordConfirm;
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                existUser = _c.sent();
                if (existUser) {
                    throw new AppError_1.default(400, "DUPLICATE_KEYS", "Email đã tồn tại.", { email: email });
                }
                // Check if password and passwordConfirm are the same
                if (password !== passwordConfirm) {
                    throw new AppError_1.default(400, "INVALID_ARGUMENTS", "Mật khẩu nhập lại không khớp.", {
                        passwordConfirm: passwordConfirm,
                    });
                }
                return [4 /*yield*/, user_model_1.default.create({
                        name: name,
                        email: email,
                        password: password,
                    })];
            case 2:
                user = _c.sent();
                // Remove password from user object
                user.password = undefined;
                _b = (0, generateToken_1.createAccessToken)(user, req), accessToken = _b.accessToken, accessTokenOptions = _b.accessTokenOptions;
                res.cookie("accessToken", accessToken, accessTokenOptions);
                res.status(201).json({
                    accessToken: accessToken,
                    data: user,
                });
                return [2 /*return*/];
        }
    });
}); };
exports.signup = signup;
var login = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, _b, _c, accessToken, accessTokenOptions;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, user_model_1.default.findOne({ email: email }, "+password +active")];
            case 1:
                user = _d.sent();
                _b = !user;
                if (_b) return [3 /*break*/, 3];
                return [4 /*yield*/, user.isCorrectPassword(password)];
            case 2:
                _b = !(_d.sent());
                _d.label = 3;
            case 3:
                if (_b)
                    throw new AppError_1.default(401, "INVALID_CREDENTIALS", "Email hoặc mật khẩu không đúng.");
                _c = (0, generateToken_1.createAccessToken)(user, req), accessToken = _c.accessToken, accessTokenOptions = _c.accessTokenOptions;
                res.cookie("accessToken", accessToken, accessTokenOptions);
                res.status(200).json({
                    accessToken: accessToken,
                    userId: user._id,
                });
                return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var logout = function (req, res, next) {
    res.cookie("accessToken", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        meta: {
            status: "success",
        },
    });
};
exports.logout = logout;
var updatePassword = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, oldPassword, newPassword, newPasswordConfirm, user, _b, accessToken, accessTokenOptions;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, oldPassword = _a.oldPassword, newPassword = _a.newPassword, newPasswordConfirm = _a.newPasswordConfirm;
                return [4 /*yield*/, user_model_1.default.findById(req.user.id).select("+password")];
            case 1:
                user = _c.sent();
                return [4 /*yield*/, user.isCorrectPassword(oldPassword)];
            case 2:
                // 2) Check if POSTed current password is correct
                if (!(_c.sent())) {
                    throw new AppError_1.default(401, "INVALID_CREDENTIALS", "Mật khẩu hiện tại không đúng.");
                }
                // 3) Check if new password and confirm password are the same
                if (newPassword !== newPasswordConfirm) {
                    throw new AppError_1.default(400, "INVALID_ARGUMENTS", "Mật khẩu nhập lại không khớp.", {
                        newPasswordConfirm: newPasswordConfirm,
                    });
                }
                // 3) If so, update password
                user.password = newPassword;
                return [4 /*yield*/, user.save()];
            case 3:
                _c.sent();
                _b = (0, generateToken_1.createAccessToken)(user, req), accessToken = _b.accessToken, accessTokenOptions = _b.accessTokenOptions;
                res.cookie("accessToken", accessToken, accessTokenOptions);
                res.status(200).json({
                    accessToken: accessToken,
                });
                return [2 /*return*/];
        }
    });
}); };
exports.updatePassword = updatePassword;
var protect = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, decoded, err_1, currentUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.headers.authorization &&
                    req.headers.authorization.startsWith("Bearer")) {
                    accessToken = req.headers.authorization.split(" ")[1];
                }
                else if (req.cookies.accessToken) {
                    accessToken = req.cookies.accessToken;
                }
                // If there is no accessToken, throw error
                if (!accessToken) {
                    throw new AppError_1.default(401, "SESSION_EXPIRED", "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.");
                }
                if (!accessToken) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, verifyToken(accessToken, process.env.ACCESS_SECRET)];
            case 2:
                decoded = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                if (err_1 instanceof jwt.TokenExpiredError) {
                    throw new AppError_1.default(401, "SESSION_EXPIRED", "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.");
                }
                else {
                    throw new AppError_1.default(401, "INVALID_TOKENS", "Phiên đăng nhập có vấn đề. Vui lòng đăng nhập lại.");
                }
                return [3 /*break*/, 4];
            case 4:
                // Check if decode is undefined
                if (!decoded) {
                    throw new AppError_1.default(401, "INVALID_TOKENS", "Phiên đăng nhập có vấn đề. Vui lòng đăng nhập lại.");
                }
                return [4 /*yield*/, user_model_1.default.findById(decoded.id)
                        .select("+passwordUpdatedAt")
                        .lean({ virtuals: true })];
            case 5:
                currentUser = _a.sent();
                if (!currentUser)
                    throw new AppError_1.default(404, "NOT_FOUND", "Người dùng không tồn tại.");
                // 4) Check if user changed password after the token was issued
                if (isChangedPasswordAfter(currentUser.passwordUpdatedAt, decoded.iat))
                    throw new AppError_1.default(401, "SESSION_EXPIRED", "Người dùng đã thay đổi mật khẩu. Vui lòng đăng nhập lại.");
                // GRANT ACCESS TO PROTECTED ROUTE
                req.user = currentUser;
                return [2 /*return*/, next()];
        }
    });
}); };
exports.protect = protect;
var restrictTo = function () {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    return function (req, res, next) {
        // Admin have access to all routes
        if (req.user.role === "admin")
            return next();
        // roles ['admin', 'cashier', 'staff', 'customer']
        if (!roles.includes(req.user.role)) {
            throw new AppError_1.default(403, "ACCESS_DENIED", "Người dùng không có quyền truy cập vào tài nguyên này.");
        }
        next();
    };
};
exports.restrictTo = restrictTo;
var passwordConfirm = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var passwordConfirm, user, isCorrectPassword;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                passwordConfirm = req.body.passwordConfirm;
                if (!passwordConfirm) {
                    throw new AppError_1.default(400, "INVALID_ARGUMENTS", "Phải có mật khẩu xác nhận.", {
                        passwordConfirm: passwordConfirm,
                    });
                }
                return [4 /*yield*/, user_model_1.default.findById(req.user.id).select("+password")];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, user.isCorrectPassword(passwordConfirm)];
            case 2:
                isCorrectPassword = _a.sent();
                if (!isCorrectPassword) {
                    throw new AppError_1.default(400, "INVALID_CREDENTIALS", "Mật khẩu xác nhận không khớp.", {
                        passwordConfirm: passwordConfirm,
                    });
                }
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.passwordConfirm = passwordConfirm;
function verifyToken(token, tokenSecret) {
    return __awaiter(this, void 0, void 0, function () {
        var decoded;
        return __generator(this, function (_a) {
            try {
                decoded = jwt.verify(token, tokenSecret, function (err, decoded) {
                    if (err)
                        throw err;
                    return decoded;
                });
                return [2 /*return*/, decoded];
            }
            catch (err) {
                if (err instanceof jwt.TokenExpiredError) {
                    throw err;
                }
                else if (err instanceof jwt.JsonWebTokenError ||
                    err instanceof jwt.NotBeforeError) {
                    throw new AppError_1.default(401, "INVALID_TOKENS", "Phiên đăng nhập có vấn đề. Vui lòng đăng nhập lại.");
                }
                else {
                    throw err;
                }
            }
            return [2 /*return*/];
        });
    });
}
function isChangedPasswordAfter(passwordUpdatedAt, JWTTimestamp) {
    // Password has been changed after user being created
    if (passwordUpdatedAt) {
        var passwordChangeTime = passwordUpdatedAt.getTime() / 1000;
        return JWTTimestamp < passwordChangeTime;
    }
    // False: token was issued before password change time
    return false;
}
//# sourceMappingURL=auth.controller.js.map