"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(details) {
    var metadata = {};
    details.forEach(function (detail) {
        var key = detail.path[2] || detail.path[1] || detail.path[0];
        metadata[key] = detail.message;
    });
    return metadata;
}
exports.default = default_1;
//# sourceMappingURL=convertToReadableMetadata.js.map