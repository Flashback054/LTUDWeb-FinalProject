import express from "express";
import * as orderController from "../controllers/order.controller";
import * as authController from "../controllers/auth.controller";
import {
	validateRequestId,
	validateRequest,
} from "../../commons/middlewares/validateRequest";
import createOrderSchema from "../schemas/order/createOrder.schema";

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.param("id", validateRequestId("id"));
router.param("user", validateRequestId("user"));

router.get(
	"/",
	orderController.checkGetAllOrdersPermission,
	orderController.getAllOrders
);
router.post(
	"/",
	validateRequest(createOrderSchema),
	orderController.createOrder
);

router.get(
	"/:id",
	orderController.checkOrderOwnership,
	orderController.getOrder
);

router
	.route("/:id")
	.patch(
		orderController.checkOrderOwnership,
		orderController.checkOrderStatus,
		orderController.updateOrder
	)
	.delete(orderController.checkOrderOwnership, orderController.deleteOrder);

// A route to pay for an order
router.post(
	"/:id/pay",
	orderController.checkOrderOwnership,
	orderController.checkOrderStatus,
	orderController.payOrder
);

export default router;
