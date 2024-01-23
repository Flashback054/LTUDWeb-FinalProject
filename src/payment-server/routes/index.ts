import PaymentRouter from "./payment.route";
import PaymentAccountRouter from "./paymentAccount.route";
import { Router } from "express";

const router = Router();

router.use("/payments", PaymentRouter);
router.use("/payment-accounts", PaymentAccountRouter);

export default router;
