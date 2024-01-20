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
var express_1 = __importDefault(require("express"));
var categoryController = __importStar(require("../controllers/category.controller"));
var authController = __importStar(require("../controllers/auth.controller"));
var validateRequest_1 = require("../middlewares/validateRequest");
var controllers_1 = require("../commons/controllers");
var router = express_1.default.Router();
router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.uploadCategoryImage, controllers_1.setImagePath, categoryController.createCategory);
router.get("/:id", (0, validateRequest_1.validateRequestId)("id"), categoryController.getCategory);
router
    .route("/:id")
    .all(authController.protect, authController.restrictTo("admin"), (0, validateRequest_1.validateRequestId)("id"))
    .patch(categoryController.uploadCategoryImage, controllers_1.setImagePath, categoryController.updateCategory)
    .delete(categoryController.deleteCategory);
exports.default = router;
//# sourceMappingURL=category.route.js.map