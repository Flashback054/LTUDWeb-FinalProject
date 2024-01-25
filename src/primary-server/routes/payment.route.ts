import express from "express";
import * as paymentController from "../controllers/payment.controller";
import * as authController from "../controllers/auth.controller";
import { validateRequestId } from "../../commons/middlewares/validateRequest";
import { setImagePath } from "../../commons/controllers";

const router = express.Router({ mergeParams: true });

router.param("id", validateRequestId("id"));

router.use(authController.protect);

router.get("/", paymentController.getAllPayments);
router.get("/:id", paymentController.getPayment);

router.use(authController.restrictTo("admin"));

router.post("/", paymentController.createPayment);

router
	.route("/:id")
	.patch(paymentController.updatePayment)
	.delete(paymentController.deletePayment);

export default router;
