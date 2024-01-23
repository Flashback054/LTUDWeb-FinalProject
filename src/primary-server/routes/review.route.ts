import express from "express";
import * as reviewController from "../controllers/review.controller";
import * as authController from "../controllers/auth.controller";
import {
	validateRequest,
	validateRequestId,
} from "../../commons/middlewares/validateRequest";
import createReviewSchema from "../schemas/review/createReview.schema";

const router = express.Router({ mergeParams: true });
router.param("id", validateRequestId("id"));

router.get("/", reviewController.getAllReviews);
router.get("/:id", reviewController.getReview);

router.use(authController.protect);

router.post(
	"/",
	reviewController.setBookAndUserOnBody,
	validateRequest(createReviewSchema),
	reviewController.catchReview(reviewController.createReview)
);
router.patch(
	"/:id",

	reviewController.checkReviewBelongsToUser,
	reviewController.catchReview(reviewController.updateReview)
);
router.delete(
	"/:id",

	reviewController.checkReviewBelongsToUser,
	reviewController.deleteReview
);

export default router;
