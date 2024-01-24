import express from "express";
import * as paymentController from "../controllers/payment.controller";
// import vnpayController from "../controllers/vnpay.controller";
import { validateRequestId } from "../../commons/middlewares/validateRequest";

const router = express.Router({ mergeParams: true });
router.param("id", validateRequestId("id"));

router.get("/", paymentController.getAllPayments);
router.get("/:id", paymentController.getPayment);
router.post("/", paymentController.createPayment);
router.patch("/:id", paymentController.updatePayment);
router.delete("/:id", paymentController.deletePayment);

export default router;
