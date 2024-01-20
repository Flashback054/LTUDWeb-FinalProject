import express from "express";
import { validateRequest } from "../middlewares/validateRequest";
import loginSchema from "../schemas/auth/login.schema";
import signupSchema from "../schemas/auth/signup.schema";
import updateMeSchema from "../schemas/auth/updateMe.schema";
import { setImagePath } from "../commons/controllers";

import * as authController from "../controllers/auth.controller";
import * as userController from "../controllers/user.controller";

const router = express.Router();

router.post("/signup", validateRequest(signupSchema), authController.signup);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/logout", authController.logout);

router.use(authController.protect);
router.get("/me", userController.setUserId, userController.getUser);
router.patch(
	"/me",
	userController.uploadUserImage,
	setImagePath,
	userController.updateMe
);

router.patch("/update-password", authController.updatePassword);
router.delete(
	"/me",
	authController.passwordConfirm,
	userController.setUserId,
	userController.deleteUser
);

export default router;
