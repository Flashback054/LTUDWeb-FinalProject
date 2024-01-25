import express from "express";
import "express-async-errors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import compression from "compression";
import cors from "cors";
import session from "express-session";
import methodOverride from "method-override";
import flash from "express-flash";
import passport from "../commons/configs/passport.config";

import globalErrorHandler from "../commons/controllers/error.controller";
import BaseRouter from "./routes";

const app = express();

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
app.options("*", cors());

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

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// compress all the response text (ex: JSON or HTML)
app.use(compression());

// Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Config response (add custom methods)
import responseConfig from "../commons/configs/response.config";
responseConfig(app);

// API routes
app.use("/api/v1", BaseRouter);

// Error handler
app.use(globalErrorHandler);

module.exports = app;
