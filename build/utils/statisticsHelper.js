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
exports.dateConverter = exports.addMissingDates = exports.addMissingBooks = void 0;
var book_model_1 = __importDefault(require("../models/book.model"));
function addMissingBooks(statisticResult, startDate, endDate, keys) {
    return __awaiter(this, void 0, void 0, function () {
        var books, includedBooks, _i, statisticResult_1, statistic, _a, books_1, book, missingBook, _b, keys_1, key;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (statisticResult.length === 0)
                        return [2 /*return*/, statisticResult];
                    return [4 /*yield*/, book_model_1.default.find({}).select("id name image")];
                case 1:
                    books = _c.sent();
                    includedBooks = new Set();
                    for (_i = 0, statisticResult_1 = statisticResult; _i < statisticResult_1.length; _i++) {
                        statistic = statisticResult_1[_i];
                        includedBooks.add(statistic.id.toString());
                    }
                    for (_a = 0, books_1 = books; _a < books_1.length; _a++) {
                        book = books_1[_a];
                        if (!includedBooks.has(book.id.toString())) {
                            missingBook = { id: book.id, name: book.name, image: book.image };
                            for (_b = 0, keys_1 = keys; _b < keys_1.length; _b++) {
                                key = keys_1[_b];
                                missingBook[key] = 0;
                            }
                            statisticResult.push(missingBook);
                        }
                    }
                    return [2 /*return*/, statisticResult.sort(function (a, b) {
                            if (a.id > b.id)
                                return 1;
                            if (a.id < b.id)
                                return -1;
                            return 0;
                        })];
            }
        });
    });
}
exports.addMissingBooks = addMissingBooks;
function addMissingDates(statisticResult, startDate, endDate, keys) {
    if (statisticResult.length === 0)
        return statisticResult;
    var type = statisticResult[0].date.length === 10 ? "day" : "month";
    if (statisticResult)
        if (type === "day") {
            var includedDates = new Set();
            for (var _i = 0, statisticResult_2 = statisticResult; _i < statisticResult_2.length; _i++) {
                var statistic = statisticResult_2[_i];
                includedDates.add(statistic.date);
            }
            var currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                var date = currentDate.toISOString().slice(0, 10);
                if (!includedDates.has(date)) {
                    var missingDate = { date: date };
                    for (var _a = 0, keys_2 = keys; _a < keys_2.length; _a++) {
                        var key = keys_2[_a];
                        missingDate[key] = 0;
                    }
                    statisticResult.push(missingDate);
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
        else if (type === "month") {
            var includedDates = new Set();
            for (var _b = 0, statisticResult_3 = statisticResult; _b < statisticResult_3.length; _b++) {
                var statistic = statisticResult_3[_b];
                includedDates.add(statistic.date);
            }
            var currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                var date = currentDate.toISOString().slice(0, 7);
                if (!includedDates.has(date)) {
                    var missingDate = { date: date };
                    for (var _c = 0, keys_3 = keys; _c < keys_3.length; _c++) {
                        var key = keys_3[_c];
                        missingDate[key] = 0;
                    }
                    statisticResult.push(missingDate);
                }
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        }
    return statisticResult.sort(function (a, b) {
        if (a.date > b.date)
            return 1;
        if (a.date < b.date)
            return -1;
        return 0;
    });
}
exports.addMissingDates = addMissingDates;
function dateConverter(startDate, endDate, type) {
    switch (type) {
        case "today":
            type = "day";
            startDate = new Date();
            endDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case "dateRange":
            type = "day";
            startDate = new Date(startDate);
            endDate = new Date(endDate);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case "month":
            startDate = new Date();
            endDate = new Date();
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case "year":
            startDate = new Date();
            endDate = new Date();
            startDate.setMonth(0, 1);
            startDate.setHours(0, 0, 0, 0);
            endDate.setMonth(11, 31);
            endDate.setHours(23, 59, 59, 999);
            break;
    }
    return { startDate: startDate, endDate: endDate, type: type };
}
exports.dateConverter = dateConverter;
//# sourceMappingURL=statisticsHelper.js.map