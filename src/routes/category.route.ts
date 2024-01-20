import express from "express";
import * as categoryController from "../controllers/category.controller";
import * as authController from "../controllers/auth.controller";
import { validateRequestId } from "../middlewares/validateRequest";
import { setImagePath } from "../commons/controllers";

const router = express.Router();

router.get("/", categoryController.getAllCategories);
router.post(
	"/",
	categoryController.uploadCategoryImage,
	setImagePath,
	categoryController.createCategory
);

router.get("/:id", validateRequestId("id"), categoryController.getCategory);
router
	.route("/:id")
	.all(
		authController.protect,
		authController.restrictTo("admin"),
		validateRequestId("id")
	)
	.patch(
		categoryController.uploadCategoryImage,
		setImagePath,
		categoryController.updateCategory
	)
	.delete(categoryController.deleteCategory);

export default router;
