import express from "express";
import * as paymentAccountController from "../controllers/paymentAccount.controller";
import * as authController from "../../primary-server/controllers/auth.controller";
import {
	validateRequestId,
	validateRequest,
} from "../../commons/middlewares/validateRequest";
import CreatePaymentAccountSchema from "../schemas/paymentAccount/createPaymentAccount.schema";

const router = express.Router({ mergeParams: true });
router.param("id", validateRequestId("id"));

router.get("/", paymentAccountController.getAllPaymentAccounts);
router.get("/:id", paymentAccountController.getPaymentAccount);
router.post(
	"/",
	validateRequest(CreatePaymentAccountSchema),
	paymentAccountController.createPaymentAccount
);
router.patch("/:id", paymentAccountController.updatePaymentAccount);
router.delete("/:id", paymentAccountController.deletePaymentAccount);

export default router;
