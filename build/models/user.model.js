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
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_lean_virtuals_1 = __importDefault(require("mongoose-lean-virtuals"));
var bcrypt = __importStar(require("bcryptjs"));
var validator_1 = require("validator");
var userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Hãy nhập tên của bạn"],
    },
    email: {
        type: String,
        required: [true, "Hãy nhập email của bạn"],
        unique: true,
        validate: [validator_1.isEmail, "Email không hợp lệ"],
    },
    password: {
        type: String,
        required: [true, "Hãy nhập mật khẩu của bạn"],
        minlength: [8, "Mật khẩu phải có ít nhất 8 ký tự"],
        select: false,
    },
    role: {
        type: String,
        enum: ["admin", "customer"],
        default: "customer",
    },
    image: {
        type: String,
        default: process.env.CLOUDINARY_USER_DEFAULT_IMAGE || "default.jpg",
    },
    imagePublicId: {
        type: String,
        default: process.env.CLOUDINARY_USER_DEFAULT_IMAGE_PUBLIC_ID,
        select: false,
    },
    phone: {
        type: String,
        validate: {
            validator: function (phone) {
                var regex = /^\d{10}$/;
                return regex.test(phone);
            },
            message: "Số điện thoại phải có 10 chữ số",
        },
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    passwordUpdatedAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
}, {
    virtuals: {
        id: {
            get: function () {
                return this._id;
            },
        },
    },
    toJSON: { virtuals: true, versionKey: false },
});
userSchema.index({ email: 1 });
////////// MIDDLEWARE ///////
// Decrypt password
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // only run this function if Password is modified
                    if (!this.isModified("password"))
                        return [2 /*return*/, next()];
                    // 12 : how CPU intensive to hash password
                    _a = this;
                    return [4 /*yield*/, bcrypt.hash(this.password, 12)];
                case 1:
                    // 12 : how CPU intensive to hash password
                    _a.password = _b.sent();
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
// Update passwordUpdatedAt
userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew)
        return next();
    // A little hack: minus 1 seconds : b/c this save process might finish after JWT being created -> error
    this.passwordUpdatedAt = new Date(Date.now() - 1000);
    next();
});
function hashPasswordOnUpdate(next) {
    return __awaiter(this, void 0, void 0, function () {
        var data, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    data = this.getUpdate();
                    if (!data.password) return [3 /*break*/, 2];
                    _a = data;
                    return [4 /*yield*/, bcrypt.hash(data.password, 12)];
                case 1:
                    _a.password = _b.sent();
                    data.passwordUpdatedAt = Date.now() - 1000;
                    _b.label = 2;
                case 2:
                    next();
                    return [2 /*return*/];
            }
        });
    });
}
userSchema.pre("updateOne", hashPasswordOnUpdate);
userSchema.pre("findOneAndUpdate", hashPasswordOnUpdate);
userSchema.pre("updateMany", hashPasswordOnUpdate);
////////// METHODS //////////
userSchema.methods.isCorrectPassword = function (inputPassword) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcrypt.compare(inputPassword, this.password)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
userSchema.methods.updatePassword = function (newPassword) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.password = newPassword;
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// Check if the password is changed after the token was issued
userSchema.methods.isChangedPasswordAfter = function (JWTTimestamp) {
    // Password has been changed after user being created
    if (this.passwordUpdatedAt) {
        var passwordChangeTime = this.passwordUpdatedAt.getTime() / 1000;
        return JWTTimestamp < passwordChangeTime;
    }
    // False: token was issued before password change time
    return false;
};
userSchema.plugin(mongoose_lean_virtuals_1.default);
var User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map