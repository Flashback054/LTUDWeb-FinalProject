import express from "express";
import * as bookController from "../controllers/book.controller";
import * as authController from "../controllers/auth.controller";
import { setImagePath } from "../commons/controllers";

import { validateRequestId } from "../middlewares/validateRequest";

const router = express.Router();

router.get("/", bookController.getAllBooks);
router.get("/:id", validateRequestId("id"), bookController.getBook);

router.use(authController.protect, authController.restrictTo("admin"));
router.post(
	"/",
	bookController.uploadBookImage,
	setImagePath,
	bookController.createBook
);
router.patch(
	"/:id",
	validateRequestId("id"),
	bookController.uploadBookImage,
	setImagePath,
	bookController.updateBook
);
router.delete("/:id", validateRequestId("id"), bookController.deleteBook);

export default router;