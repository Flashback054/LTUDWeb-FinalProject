"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var statisticController = require("../controllers/statistic.controller");
var authController = require("../controllers/auth.controller");
var router = express.Router();
router.use(authController.protect, authController.restrictTo("admin"));
router.get("/count-selling-books", statisticController.countSellingBooks);
router.get("/count-new-orders", statisticController.countNewOrders);
router.get("/top-5-low-stock-books", statisticController.getTop5LowStockBooks);
router.get("/revenue-and-profit-stats", statisticController.getRevenueAndProfitStats);
router.get("/book-sale-stats", statisticController.getBookSaleStats);
router.get("/count-books", statisticController.countBooks);
exports.default = router;
//# sourceMappingURL=statistic.route.js.map