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
var validateRequest_1 = require("../middlewares/validateRequest");
var login_schema_1 = __importDefault(require("../schemas/auth/login.schema"));
var signup_schema_1 = __importDefault(require("../schemas/auth/signup.schema"));
var controllers_1 = require("../commons/controllers");
var authController = __importStar(require("../controllers/auth.controller"));
var userController = __importStar(require("../controllers/user.controller"));
var router = express_1.default.Router();
router.post("/signup", (0, validateRequest_1.validateRequest)(signup_schema_1.default), authController.signup);
router.post("/login", (0, validateRequest_1.validateRequest)(login_schema_1.default), authController.login);
router.post("/logout", authController.logout);
router.use(authController.protect);
router.get("/me", userController.setUserId, userController.getUser);
router.patch("/me", userController.uploadUserImage, controllers_1.setImagePath, userController.updateMe);
router.patch("/update-password", authController.updatePassword);
router.delete("/me", authController.passwordConfirm, userController.setUserId, userController.deleteUser);
exports.default = router;
//# sourceMappingURL=auth.route.js.map