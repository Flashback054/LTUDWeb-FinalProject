import { Router } from "express";

import AuthRouter from "./auth.route";
import BookRouter from "./book.route";
import CategoryRouter from "./category.route";
import OrderRouter from "./order.route";
import ReviewRouter from "./review.route";
import StatisticRouter from "./statistic.route";
import UserRouter from "./user.route";
import ChargeHistoryRouter from "./chargeHistory.route";
import PaymentAcountRouter from "./paymentAccount.route";
import PaymentRouter from "./payment.route";
import { optionalValidateJWT } from "../../commons/middlewares/serverAuthJwt";

const router = Router();

router.use(optionalValidateJWT);

router.use("/users", UserRouter);
router.use("/books", BookRouter);
router.use("/orders", OrderRouter);
router.use("/auth", AuthRouter);
router.use("/statistics", StatisticRouter);
router.use("/categories", CategoryRouter);
router.use("/reviews", ReviewRouter);
router.use("/charge-histories", ChargeHistoryRouter);
router.use("/payment-accounts", PaymentAcountRouter);
router.use("/payments", PaymentRouter);

export default router;
