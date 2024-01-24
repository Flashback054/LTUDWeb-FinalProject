import express from "express";
import * as bookController from "../controllers/book.controller";
import * as authController from "../controllers/auth.controller";
import { setImagePath } from "../../commons/controllers";

import { validateRequestId } from "../../commons/middlewares/validateRequest";

const router = express.Router();

router.param("id", validateRequestId("id"));

router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBook);

router.use(authController.protect, authController.restrictTo("admin"));
router.post(
	"/",
	bookController.uploadBookImage,
	setImagePath,
	bookController.createBook
);
router.patch(
	"/:id",
	bookController.uploadBookImage,
	setImagePath,
	bookController.updateBook
);
router.delete("/:id", bookController.deleteBook);

export default router;
