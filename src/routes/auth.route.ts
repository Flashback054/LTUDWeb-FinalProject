import express from "express";
import passport from "passport";
import { validateRequest } from "../middlewares/validateRequest";
import loginSchema from "../schemas/auth/login.schema";
import signupSchema from "../schemas/auth/signup.schema";
import updateMeSchema from "../schemas/auth/updateMe.schema";
import { setImagePath } from "../commons/controllers";

import * as authController from "../controllers/auth.controller";
import * as userController from "../controllers/user.controller";

const router = express.Router();

import { Request, Response, NextFunction } from "express";

// OAuth 2.0 Endpoints
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['email', 'profile'],
        accessType: 'offline',
        prompt: 'consent',
    })
);

router.get(
    '/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/api/v1/auth/failure',
        session: true,
    }),
    (req: Request, res: Response) => {
        console.log('Google called our callback!');
        // Thêm mã xử lý tại đây...
    }
);

router.get("/failure", (req, res, next) => {
	res.send("Authorization failed!");
});

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
