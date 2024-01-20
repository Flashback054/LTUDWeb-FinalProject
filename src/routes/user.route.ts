import express from "express";
import * as userController from "../controllers/user.controller";
import * as authController from "../controllers/auth.controller";
import orderRouter from "./order.route";
import paymentRouter from "./payment.route";
import { setImagePath } from "../commons/controllers";

const router = express.Router();

// Orders belong to a user
router.use("/:userId/orders", orderRouter);
router.use("/:userId/payments", paymentRouter);

router.use(authController.protect, authController.restrictTo("admin"));

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.post(
	"/",
	userController.uploadUserImage,
	setImagePath,
	userController.createUser
);
router.patch(
	"/:id",
	userController.uploadUserImage,
	setImagePath,
	userController.updateUser
);
router.delete("/:id", userController.deleteUser);

export default router;
