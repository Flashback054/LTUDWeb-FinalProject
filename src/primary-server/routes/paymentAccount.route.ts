import express from "express";
import * as PaymentAccountController from "../controllers/paymentAccount.controller";
import * as AuthController from "../controllers/auth.controller";

const router = express.Router();

router.use(AuthController.protect);

router.get("/", PaymentAccountController.getAllPaymentAccounts);
router.get("/me", PaymentAccountController.getMyPaymentAccount);
router.get("/:id", PaymentAccountController.getPaymentAccount);

router.use(AuthController.restrictTo("admin"));
router.post("/", PaymentAccountController.createPaymentAccount);
router.patch("/:id", PaymentAccountController.updatePaymentAccount);
router.delete("/:id", PaymentAccountController.deletePaymentAccount);

export default router;
