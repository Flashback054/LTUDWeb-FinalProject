import PaymentRouter from "./payment.route";
import PaymentAccountRouter from "./paymentAccount.route";
import ChargeHistoryRouter from "./chargeHistory.route";
import { requireValidateJWT } from "../../commons/middlewares/serverAuthJwt";
import { Router } from "express";

const router = Router();

// router.use(requireValidateJWT);

router.use("/payments", PaymentRouter);
router.use("/payment-accounts", PaymentAccountRouter);
router.use("/charge-histories", ChargeHistoryRouter);

export default router;
