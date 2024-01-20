"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setImagePath = void 0;
var setImagePath = function (req, res, next) {
    if (!req.file)
        return next();
    var file = req.file;
    req.body.image = file.path;
    req.body.imagePublicId = file.filename;
    return next();
};
exports.setImagePath = setImagePath;
//# sourceMappingURL=index.js.map