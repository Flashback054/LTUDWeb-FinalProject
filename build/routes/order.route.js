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
var orderController = __importStar(require("../controllers/order.controller"));
var authController = __importStar(require("../controllers/auth.controller"));
var validateRequest_1 = require("../middlewares/validateRequest");
var createOrder_schema_1 = __importDefault(require("../schemas/order/createOrder.schema"));
var router = express_1.default.Router({ mergeParams: true });
router.use(authController.protect);
router.param("id", (0, validateRequest_1.validateRequestId)("id"));
router.param("userId", (0, validateRequest_1.validateRequestId)("userId"));
router.get("/", orderController.checkGetAllOrdersPermission, orderController.getAllOrders);
router.post("/", (0, validateRequest_1.validateRequest)(createOrder_schema_1.default), orderController.createOrder);
router.get("/:id", orderController.checkOrderOwnership, orderController.getOrder);
router
    .route("/:id")
    .patch(orderController.checkOrderOwnership, orderController.checkOrderStatus, orderController.updateOrder)
    .delete(orderController.checkOrderOwnership, orderController.deleteOrder);
// A route to pay for an order
router.post("/:id/pay", orderController.checkOrderOwnership, orderController.checkOrderStatus, orderController.payOrder);
exports.default = router;
//# sourceMappingURL=order.route.js.map