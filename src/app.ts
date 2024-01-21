import express from "express";
import "express-async-errors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import compression from "compression";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";

import globalErrorHandler from "./controllers/error.controller";

// Import routers
import BookRouter from "./routes/book.route";
import UserRouter from "./routes/user.route";
import OrderRouter from "./routes/order.route";
import AuthRouter from "./routes/auth.route";
import StatisticRouter from "./routes/statistic.route";
import CategoryRouter from "./routes/category.route";
import ReviewRouter from "./routes/review.route";

// config passport
interface Config {
	GOOGLE_CLIENT_ID: string | undefined;
	GOOGLE_CLIENT_SECRET: string | undefined;
	COOKIE_SESSION_KEY1: string;
	COOKIE_SESSION_KEY2: string;
}

const config: Config = {
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	COOKIE_SESSION_KEY1: process.env.COOKIE_SESSION_KEY1 || "key1",
	COOKIE_SESSION_KEY2: process.env.COOKIE_SESSION_KEY2 || "key2",
};

// Set up Google OAuth 2.0
const AUTH_OPTIONS = {
	callbackURL: "http://localhost:8080/api/v1/auth/google/callback",
	clientID: config.GOOGLE_CLIENT_ID,
	clientSecret: config.GOOGLE_CLIENT_SECRET,
	scope: ["email", "profile", "openid"],
};

const verifyCallback = (
	accessToken: string,
	refreshToken: string,
	profile: any,
	done: any
) => {
	// console.log("Google profile: ", profile);
	process.nextTick(() => {
		return done(null, profile);
	});
};

// Passport's Strategy and
passport.use(new GoogleStrategy(AUTH_OPTIONS, verifyCallback));
passport.serializeUser((user: any, done) => {
	done(null, user.id);
});
passport.deserializeUser((obj: any, done) => {
	done(null, obj);
});

const app = express();

// cookie-session
app.use(
	session({
		secret: "your secret",
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: "auto", // tự động chuyển sang secure nếu ứng dụng chạy trên HTTPS
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000, // 24 hours
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

// Trust proxy
app.enable("trust proxy");

// CORS;
const allowOrigins = ["http://localhost:5173", "http://localhost:4173"];
app.use(
	cors({
		credentials: true,
		origin: allowOrigins,
	})
);
// Implement CORS on all OPTIONS request
// Browser send OPTIONS req on preflight phase (before non-simple req like PUT,PATCH,DELETE,...)
// -> inorder to verify that the non-simple req is safe to perform
// -> we must set CORS on response
app.options("*", cors());

//////// IMPORTANT : helmet should be used in every Express app
// Security HTTP headers
app.use(
	helmet({
		crossOriginEmbedderPolicy: false,
		crossOriginResourcePolicy: {
			policy: "cross-origin",
		},
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["*"],
				scriptSrc: [
					"* data: 'unsafe-eval' 'unsafe-inline' blob: https://sandbox.vnpayment.vn",
				],
				connectSrc: ["*", "https://sandbox.vnpayment.vn"],
				frameSrc: ["*", "https://sandbox.vnpayment.vn"],
				navigateTo: ["*"],
			},
		},
	})
);

//////// IMPORTANT ////////
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
// replace malicious HTML code : ex : <div id='error-code'></div> -> &lt;div id='error-code'&gt;...
app.use(xss());

// compress all the response text (ex: JSON or HTML)
app.use(compression());

// Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Set static files
app.use(express.static(`${__dirname}/public`));

// Define response methods
app.response.ok = function (data: any) {
	this.status(200).json({
		data,
	});
};
app.response.created = function (data: any) {
	this.status(201).json({
		data,
	});
};
app.response.noContent = function () {
	this.status(204).json();
};
app.response.badRequest = function (error: any) {
	this.status(400).json({
		error,
	});
};
app.response.unauthorized = function (error: any) {
	this.status(401).json({
		error,
	});
};
app.response.forbidden = function (error: any) {
	this.status(403).json({
		error,
	});
};
app.response.notFound = function (error: any) {
	this.status(404).json({
		error,
	});
};
app.response.error = function (error: any) {
	this.status(500).json({
		error,
	});
};

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/books", BookRouter);
app.use("/api/v1/orders", OrderRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/statistics", StatisticRouter);
app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/reviews", ReviewRouter);

// Error handler
app.use(globalErrorHandler);

module.exports = app;
