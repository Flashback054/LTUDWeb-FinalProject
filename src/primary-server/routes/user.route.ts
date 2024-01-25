import express from "express";
import * as userController from "../controllers/user.controller";
import * as authController from "../controllers/auth.controller";
import OrderRouter from "./order.route";
import PaymentRouter from "./payment.route";
import allowNestedQueries from "../../commons/middlewares/allowNestedQueries";
import { setImagePath } from "../../commons/controllers";
import { validateRequestId } from "../../commons/middlewares/validateRequest";

const router = express.Router();
router.param("id", validateRequestId("id"));
router.param("user", validateRequestId("user"));

// Orders belong to a user
router.use("/:user/orders", allowNestedQueries("user"), OrderRouter);
router.use("/:user/payments", allowNestedQueries("user"), PaymentRouter);

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
