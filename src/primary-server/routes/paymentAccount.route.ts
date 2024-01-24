import express from "express";
import * as PaymentAccountController from "../controllers/paymentAccount.controller";

const router = express.Router();

router.get("/", PaymentAccountController.getAllPaymentAccounts);
router.get("/:id", PaymentAccountController.getPaymentAccount);
router.post("/", PaymentAccountController.createPaymentAccount);
router.patch("/:id", PaymentAccountController.updatePaymentAccount);

export default router;
