"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var authController = require("../controllers/auth.controller");
var couponController = require("../controllers/coupon.controller");
var validateRequestId = require("../middlewares/validateRequest").validateRequestId;
var router = express.Router();
router.get("/:id", validateRequestId("id"), couponController.getCoupon);
router.use(authController.protect, authController.restrictTo("admin"));
router.get("/", couponController.getAllCoupons);
router.post("/", couponController.createCoupon);
router
    .route("/:id")
    .all(validateRequestId("id"))
    .patch(couponController.updateCoupon)
    .delete(couponController.deleteCoupon);
exports.default = router;
//# sourceMappingURL=coupon.route.js.map