import { Router } from "express";

import AuthRouter from "./auth.route";
import BookRouter from "./book.route";
import CategoryRouter from "./category.route";
import OrderRouter from "./order.route";
import ReviewRouter from "./review.route";
import StatisticRouter from "./statistic.route";
import UserRouter from "./user.route";

const router = Router();

router.use("/users", UserRouter);
router.use("/books", BookRouter);
router.use("/orders", OrderRouter);
router.use("/auth", AuthRouter);
router.use("/statistics", StatisticRouter);
router.use("/categories", CategoryRouter);
router.use("/reviews", ReviewRouter);

export default router;
