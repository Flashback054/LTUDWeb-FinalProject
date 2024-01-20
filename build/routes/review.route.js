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
var reviewController = __importStar(require("../controllers/review.controller"));
var authController = __importStar(require("../controllers/auth.controller"));
var validateRequest_1 = require("../middlewares/validateRequest");
var createReview_schema_1 = __importDefault(require("../schemas/review/createReview.schema"));
var router = express_1.default.Router({ mergeParams: true });
router.get("/", reviewController.getAllReviews);
router.get("/:id", (0, validateRequest_1.validateRequestId)("id"), reviewController.getReview);
router.use(authController.protect);
router.post("/", reviewController.setBookAndUserOnBody, (0, validateRequest_1.validateRequest)(createReview_schema_1.default), reviewController.catchReview(reviewController.createReview));
router.patch("/:id", (0, validateRequest_1.validateRequestId)("id"), reviewController.checkReviewBelongsToUser, reviewController.catchReview(reviewController.updateReview));
router.delete("/:id", (0, validateRequest_1.validateRequestId)("id"), reviewController.checkReviewBelongsToUser, reviewController.deleteReview);
exports.default = router;
//# sourceMappingURL=review.route.js.map