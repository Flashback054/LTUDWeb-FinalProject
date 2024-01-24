import express from "express";
import * as authController from "../../primary-server/controllers/auth.controller";
import * as chargeHistoryController from "../controllers/chargeHistory.controller";
import {
	validateRequestId,
	validateRequest,
} from "../../commons/middlewares/validateRequest";
import * as vnpayController from "../controllers/vnpay.controller";

const router = express.Router({ mergeParams: true });
router.param("id", validateRequestId("id"));

router.get("/vnpay-return", vnpayController.vnpayReturn);

router.use(authController.protect);

router.get("/", chargeHistoryController.getAllChargeHistories);
router.get("/:id", chargeHistoryController.getChargeHistory);
router.post(
	"/",
	chargeHistoryController.createChargeHistory,
	vnpayController.createVNPAYCharge
);

export default router;
