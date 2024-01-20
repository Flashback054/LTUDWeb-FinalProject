import express from "express";
import "express-async-errors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import compression from "compression";
import cors from "cors";

import globalErrorHandler from "./controllers/error.controller";

// Import routers
import BookRouter from "./routes/book.route";
import UserRouter from "./routes/user.route";
import OrderRouter from "./routes/order.route";
import AuthRouter from "./routes/auth.route";
import PaymentRouter from "./routes/payment.route";
import StatisticRouter from "./routes/statistic.route";
import CategoryRouter from "./routes/category.route";
import CouponRouter from "./routes/coupon.route";
import ReviewRouter from "./routes/review.route";

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

// Routes
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/books", BookRouter);
app.use("/api/v1/orders", OrderRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/payments", PaymentRouter);
app.use("/api/v1/statistics", StatisticRouter);
app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/reviews", ReviewRouter);

// Error handler
app.use(globalErrorHandler);

module.exports = app;
