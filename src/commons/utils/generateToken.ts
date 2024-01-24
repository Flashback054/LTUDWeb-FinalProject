import * as jwt from "jsonwebtoken";
import { Request } from "express";

export function signToken(id: string, secret: string, expires: string) {
	return jwt.sign({ id }, secret, {
		expiresIn: expires,
	});
}

export function createAccessToken(user: any, req: Request) {
	const accessToken = signToken(
		user._id,
		process.env.ACCESS_SECRET,
		process.env.ACCESS_EXPIRES_IN
	);

	const accessTokenOptions = {
		expires: new Date(
			// valid for 1 day
			Date.now() + +process.env.ACCESS_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		secure: false,
	};

	if (req.secure || req.headers["x-forwarded-proto"] === "https") {
		accessTokenOptions.secure = true;
	}

	return { accessToken, accessTokenOptions };
}

// exports.createRefreshToken = (user, req) => {
// 	const refreshToken = signToken(
// 		user._id,
// 		process.env.REFRESH_SECRET,
// 		process.env.REFRESH_EXPIRES_IN
// 	);

// 	const refreshTokenOptions = {
// 		expires: new Date(
// 			// valid for 1 day
// 			Date.now() + process.env.REFRESH_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
// 		),
// 		httpOnly: true,
// 	};

// 	if (req.secure || req.headers["x-forwarded-proto"] === "https") {
// 		refreshTokenOptions.secure = true;
// 	}

// 	return { refreshToken, refreshTokenOptions };
// };
