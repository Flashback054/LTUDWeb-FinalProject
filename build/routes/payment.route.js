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
var paymentController = __importStar(require("../controllers/payment.controller"));
var vnpay_controller_1 = __importDefault(require("../controllers/vnpay.controller"));
var validateRequest_1 = require("../middlewares/validateRequest");
var router = express_1.default.Router({ mergeParams: true });
router.get("/vnpay-return", vnpay_controller_1.default.vnpayReturn);
router.get("/", paymentController.getAllPayments);
router.get("/:id", (0, validateRequest_1.validateRequestId)("id"), paymentController.getPayment);
router.post("/", paymentController.createPayment);
// router.get("/vnpay-ipn", vnpayController.vnpayIPN);
router.patch("/:id", (0, validateRequest_1.validateRequestId)("id"), paymentController.updatePayment);
router.delete("/:id", (0, validateRequest_1.validateRequestId)("id"), paymentController.deletePayment);
exports.default = router;
//# sourceMappingURL=payment.route.js.map