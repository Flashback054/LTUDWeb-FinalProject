import express from "express";
import "express-async-errors";
import path from "path";
import { create } from "express-handlebars";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import compression from "compression";
import cors from "cors";
import session from "express-session";
import methodOverride from "method-override";
import flash from "express-flash";
import passport from "./configs/passport.config";

import globalErrorHandler from "./controllers/error.controller";
import BaseRouter from "./routes";

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

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Trust proxy
app.enable("trust proxy");

// View engine
const hbs = create({
	extname: ".html",
});
app.engine("html", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

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

// Set static files
app.use(express.static(`${__dirname}/public`));

// Config response (add custom methods)
import responseConfig from "./configs/response.config";
responseConfig(app);

// Method override
app.use(methodOverride("_method"));
// Flash
app.use(flash());

// API routes
app.use("/api/v1", BaseRouter);

// Test handlebars
app.get("/", (req, res) => {
	res.render("home", {
		title: "Home",
		message: "Hello world",
	});
});

// Error handler
app.use(globalErrorHandler);

module.exports = app;
