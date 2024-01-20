import express from "express";
import * as paymentController from "../controllers/payment.controller";
import vnpayController from "../controllers/vnpay.controller";
import { validateRequestId } from "../middlewares/validateRequest";

const router = express.Router({ mergeParams: true });

router.get("/vnpay-return", vnpayController.vnpayReturn);

router.get("/", paymentController.getAllPayments);
router.get("/:id", validateRequestId("id"), paymentController.getPayment);
router.post("/", paymentController.createPayment);
// router.get("/vnpay-ipn", vnpayController.vnpayIPN);
router.patch("/:id", validateRequestId("id"), paymentController.updatePayment);
router.delete("/:id", validateRequestId("id"), paymentController.deletePayment);

export default router;
