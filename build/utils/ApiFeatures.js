"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var APIFeatures = /** @class */ (function () {
    function APIFeatures(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    APIFeatures.prototype.filter = function () {
        // 1A) Filtering
        var queryObj = __assign({}, this.queryString);
        var excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach(function (el) { return delete queryObj[el]; });
        // 1B) Advanced filtering
        var queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, function (match) { return "$".concat(match); });
        queryObj = JSON.parse(queryStr);
        // Implement search
        if (queryObj.q) {
            var searchField = queryObj["search-field"] || "name";
            queryObj[searchField] = { $regex: "".concat(queryObj.q), $options: "i" };
            delete queryObj.q;
            delete queryObj["search-field"];
        }
        this.query = this.query.find(queryObj);
        this.filterObj = queryObj;
        return this;
    };
    APIFeatures.prototype.sort = function () {
        if (this.queryString.sort) {
            var sortBy = this.queryString.sort.replace(/,/g, " ");
            this.query = this.query.sort(sortBy);
            // this.query.sort('price ratingsAverage');
        }
        else {
            this.query = this.query.sort("-_id");
        }
        return this;
    };
    APIFeatures.prototype.limitFields = function () {
        if (this.queryString.fields) {
            var fields = this.queryString.fields.replace(/,/g, " ");
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select("-__v");
        }
        return this;
    };
    APIFeatures.prototype.paginate = function () {
        var page = +this.queryString.page * 1 || 1;
        var limit = +this.queryString.limit * 1 || 100;
        var skipValue = (page - 1) * limit;
        // query.skip: skip a number of docs from beginning
        // query.limit : limit output to a custom number
        this.query = this.query.skip(skipValue).limit(limit);
        return this;
    };
    return APIFeatures;
}());
exports.default = APIFeatures;
//# sourceMappingURL=ApiFeatures.js.map