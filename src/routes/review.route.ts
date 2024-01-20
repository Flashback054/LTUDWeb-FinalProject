import express from "express";
import * as reviewController from "../controllers/review.controller";
import * as authController from "../controllers/auth.controller";
import {
	validateRequest,
	validateRequestId,
} from "../middlewares/validateRequest";
import createReviewSchema from "../schemas/review/createReview.schema";

const router = express.Router({ mergeParams: true });

router.get("/", reviewController.getAllReviews);
router.get("/:id", validateRequestId("id"), reviewController.getReview);

router.use(authController.protect);

router.post(
	"/",
	reviewController.setBookAndUserOnBody,
	validateRequest(createReviewSchema),
	reviewController.catchReview(reviewController.createReview)
);
router.patch(
	"/:id",
	validateRequestId("id"),
	reviewController.checkReviewBelongsToUser,
	reviewController.catchReview(reviewController.updateReview)
);
router.delete(
	"/:id",
	validateRequestId("id"),
	reviewController.checkReviewBelongsToUser,
	reviewController.deleteReview
);

export default router;
