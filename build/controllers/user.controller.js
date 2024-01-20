"use strict";
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
exports.setUserId = exports.updateMe = exports.uploadUserImage = exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUsers = exports.createUser = void 0;
var controller_factory_1 = __importDefault(require("./controller.factory"));
var AppError_1 = __importDefault(require("../utils/AppError"));
var cloudinary_config_1 = __importDefault(require("../configs/cloudinary.config"));
var cloudinary_1 = require("cloudinary");
var user_model_1 = __importDefault(require("../models/user.model"));
var CloudinaryUserStorage = new cloudinary_config_1.default(user_model_1.default);
// For admin to manage users
var createUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var newUser, err_1, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 8]);
                return [4 /*yield*/, user_model_1.default.findOne({ email: req.body.email })];
            case 1:
                // Check if email is already taken
                if (_a.sent()) {
                    throw new AppError_1.default(400, "BAD_REQUEST", "Email ".concat(req.body.email, " \u0111\u00E3 \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng."), {
                        email: req.body.email,
                    });
                }
                return [4 /*yield*/, user_model_1.default.create(req.body)];
            case 2:
                newUser = _a.sent();
                // Remove password and from user object
                newUser.password = undefined;
                res.status(201).json({
                    data: newUser,
                });
                return [3 /*break*/, 8];
            case 3:
                err_1 = _a.sent();
                if (!req.file) return [3 /*break*/, 7];
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, cloudinary_1.v2.uploader.destroy(req.file.filename)];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                err_2 = _a.sent();
                console.log(err_2);
                return [3 /*break*/, 7];
            case 7: throw err_1;
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.createUser = createUser;
exports.getAllUsers = controller_factory_1.default.getAll(user_model_1.default);
exports.getUser = controller_factory_1.default.getOne(user_model_1.default);
exports.updateUser = controller_factory_1.default.updateOne(user_model_1.default);
exports.deleteUser = controller_factory_1.default.deleteOne(user_model_1.default);
// ----- For customer to manage their own account -----
// For uploading user image
exports.uploadUserImage = CloudinaryUserStorage.upload.single("image");
var updateMe = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var allowedFields_1, receivedFields, notAllowedFields, metadata_1, oldUser, updatedUser, err_3, err_4, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 12]);
                allowedFields_1 = ["name", "phone", "image", "imagePublicId"];
                receivedFields = Object.keys(req.body);
                notAllowedFields = receivedFields.filter(function (field) { return !allowedFields_1.includes(field); });
                if (notAllowedFields.length > 0) {
                    metadata_1 = {};
                    notAllowedFields.forEach(function (field) {
                        metadata_1[field] = req.body[field];
                    });
                    throw new AppError_1.default(400, "BAD_REQUEST", "Kh\u00F4ng th\u1EC3 c\u1EADp nh\u1EADt tr\u01B0\u1EDDng ".concat(notAllowedFields.join(", "), "."), metadata_1);
                }
                return [4 /*yield*/, user_model_1.default.findById(req.user.id)
                        .select("+imagePublicId")
                        .lean({ virtuals: true })];
            case 1:
                oldUser = _a.sent();
                return [4 /*yield*/, user_model_1.default.findByIdAndUpdate(req.user.id, req.body, {
                        new: true,
                        runValidators: true,
                    })];
            case 2:
                updatedUser = _a.sent();
                if (!((oldUser === null || oldUser === void 0 ? void 0 : oldUser.image) &&
                    oldUser.image !== updatedUser.image &&
                    !(oldUser.image.search("default") !== -1)) // prevent deleting default image
                ) return [3 /*break*/, 6]; // prevent deleting default image
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, cloudinary_1.v2.uploader.destroy(oldUser.imagePublicId)];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                err_3 = _a.sent();
                console.log(err_3);
                return [3 /*break*/, 6];
            case 6:
                res.status(200).json({
                    data: updatedUser,
                });
                return [3 /*break*/, 12];
            case 7:
                err_4 = _a.sent();
                if (!req.file) return [3 /*break*/, 11];
                _a.label = 8;
            case 8:
                _a.trys.push([8, 10, , 11]);
                return [4 /*yield*/, cloudinary_1.v2.uploader.destroy(req.file.filename)];
            case 9:
                _a.sent();
                return [3 /*break*/, 11];
            case 10:
                err_5 = _a.sent();
                console.log(err_5);
                return [3 /*break*/, 11];
            case 11: throw err_4;
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.updateMe = updateMe;
var setUserId = function (req, res, next) {
    req.params.id = req.user.id.toString();
    next();
};
exports.setUserId = setUserId;
//# sourceMappingURL=user.controller.js.map