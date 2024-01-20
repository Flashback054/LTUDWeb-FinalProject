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
var cloudinary_1 = require("cloudinary");
var AppError_1 = __importDefault(require("../utils/AppError"));
var ApiFeatures_1 = __importDefault(require("../utils/ApiFeatures"));
var createOne = function (Model, options) {
    return function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var newDoc, err_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 9]);
                    return [4 /*yield*/, Model.create(req.body)];
                case 1:
                    newDoc = _a.sent();
                    if (!((options === null || options === void 0 ? void 0 : options.populate) && newDoc.populate)) return [3 /*break*/, 3];
                    return [4 /*yield*/, newDoc.populate(options.populate)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    res.status(201).json({
                        data: newDoc,
                    });
                    return [3 /*break*/, 9];
                case 4:
                    err_1 = _a.sent();
                    if (!req.file) return [3 /*break*/, 8];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, cloudinary_1.v2.uploader.destroy(req.file.filename)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _a.sent();
                    console.log(err_2);
                    return [3 /*break*/, 8];
                case 8: throw err_1;
                case 9: return [2 /*return*/];
            }
        });
    }); };
};
var getAll = function (Model, options) {
    return function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, key, features, docs, count;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // // Allow nested routes
                    // CURRENTLY COMMENTED OUT FOR REFACORING (add those id to query manually in route)
                    if (options && options.allowNestedQueries) {
                        for (_i = 0, _a = options.allowNestedQueries; _i < _a.length; _i++) {
                            key = _a[_i];
                            if (req.params[key]) {
                                req.query[key] = req.params[key];
                            }
                        }
                    }
                    // Allow filtering by today's date
                    // Loops through query string, find any key that has a value of "today"
                    // and replace it with an object that specifies the range of today's date
                    Object.keys(req.query).forEach(function (key) {
                        if (req.query[key] === "today") {
                            // Filter orders by today's date
                            var today = new Date();
                            today.setHours(0, 0, 0, 0);
                            var tomorrow = new Date(today);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            req.query[key] = {
                                $gte: today.toISOString(),
                                $lt: tomorrow.toISOString(),
                            };
                        }
                    });
                    features = new ApiFeatures_1.default(Model.find(), req.query)
                        .filter()
                        .limitFields()
                        .paginate()
                        .sort();
                    // Populate options
                    if (options === null || options === void 0 ? void 0 : options.populate) {
                        features.query.populate(options.populate);
                    }
                    return [4 /*yield*/, features.query.lean({ virtuals: true })];
                case 1:
                    docs = _b.sent();
                    return [4 /*yield*/, Model.countDocuments(features.filterObj)];
                case 2:
                    count = _b.sent();
                    // SEND RESPONSE
                    // Set X-Total-Count header
                    res.set("Access-Control-Expose-Headers", "X-Total-Count");
                    res.set("X-Total-Count", count);
                    res.status(200).json({
                        data: docs,
                    });
                    return [2 /*return*/];
            }
        });
    }); };
};
var getOne = function (Model, options) {
    return function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var query, doc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = Model.findById(req.params.id).lean({ virtuals: true });
                    if (options === null || options === void 0 ? void 0 : options.populate) {
                        query.populate(options.populate);
                    }
                    return [4 /*yield*/, query];
                case 1:
                    doc = _a.sent();
                    if (!doc) {
                        throw new AppError_1.default(404, "NOT_FOUND", "Kh\u00F4ng t\u00ECm th\u1EA5y ".concat(Model.modelName.toLowerCase(), " v\u1EDBi ID ").concat(req.params.id), {
                            id: req.params.id,
                            modelName: Model.modelName.toLowerCase(),
                        });
                    }
                    res.status(200).json({
                        data: doc,
                    });
                    return [2 /*return*/];
            }
        });
    }); };
};
var updateOne = function (Model, options) {
    return function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var oldDoc, updatedDoc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Model.findById(req.params.id)
                        .select("+imagePublicId")
                        .lean({ virtuals: true })];
                case 1:
                    oldDoc = _a.sent();
                    return [4 /*yield*/, Model.findByIdAndUpdate(req.params.id, req.body, {
                            new: true,
                            runValidators: true,
                        })];
                case 2:
                    updatedDoc = _a.sent();
                    if (!updatedDoc) {
                        throw new AppError_1.default(404, "NOT_FOUND", "Kh\u00F4ng t\u00ECm th\u1EA5y ".concat(Model.modelName.toLowerCase(), " v\u1EDBi ID ").concat(req.params.id), {
                            id: req.params.id,
                            modelName: Model.modelName.toLowerCase(),
                        });
                    }
                    if (!(oldDoc &&
                        oldDoc.image &&
                        oldDoc.image !== updatedDoc.image &&
                        !(oldDoc.image.search("default") !== -1)) // prevent deleting default image
                    ) return [3 /*break*/, 4]; // prevent deleting default image
                    // Use cloudinary to delete old image
                    return [4 /*yield*/, cloudinary_1.v2.uploader.destroy(oldDoc.imagePublicId)];
                case 3:
                    // Use cloudinary to delete old image
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(options === null || options === void 0 ? void 0 : options.populate)) return [3 /*break*/, 6];
                    return [4 /*yield*/, updatedDoc.populate(options.populate)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    res.status(200).json({
                        data: updatedDoc,
                    });
                    return [2 /*return*/];
            }
        });
    }); };
};
var deleteOne = function (Model) {
    return function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var doc, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Model.findOneAndDelete({ _id: req.params.id }).select("+imagePublicId")];
                case 1:
                    doc = _a.sent();
                    if (!doc) {
                        throw new AppError_1.default(404, "NOT_FOUND", "Kh\u00F4ng t\u00ECm th\u1EA5y ".concat(Model.modelName.toLowerCase(), " v\u1EDBi ID ").concat(req.params.id), {
                            id: req.params.id,
                            modelName: Model.modelName.toLowerCase(),
                        });
                    }
                    if (!(doc.image &&
                        !(doc.image.search("default") !== -1)) // prevent deleting default image
                    ) return [3 /*break*/, 5]; // prevent deleting default image
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, cloudinary_1.v2.uploader.destroy(doc.imagePublicId)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_3 = _a.sent();
                    console.log(err_3);
                    return [3 /*break*/, 5];
                case 5:
                    res.status(204).json({
                        data: null,
                    });
                    return [2 /*return*/];
            }
        });
    }); };
};
exports.default = { createOne: createOne, getAll: getAll, getOne: getOne, updateOne: updateOne, deleteOne: deleteOne };
//# sourceMappingURL=controller.factory.js.map