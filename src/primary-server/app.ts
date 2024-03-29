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
import passport from "../commons/configs/passport.config";

import globalErrorHandler from "../commons/controllers/error.controller";
import BaseRouter from "./routes";
import ViewRouter from "./routes/view.route";

const app = express();

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

app.enable("trust proxy");

// View engine
const hbs = create({
	extname: ".html",
	layoutsDir: `${__dirname}/views/layouts`,
	partialsDir: `${__dirname}/views/components/`,
	helpers: {
		currencyFormat(value: number | bigint) {
			return Intl.NumberFormat("vi-VN", {
				style: "currency",
				currency: "VND",
			}).format(value);
		},
		currentYear() {
			return new Date().getFullYear();
		},
		ratingStar(rating: number) {
			const wholeRating = Math.floor(rating);
			let result = "";

			for (let i = 0; i < wholeRating; i++) {
				result += `<i class="fas fa-star"></i>`;
			}

			if (rating > wholeRating) {
				result += `<i class="fas fa-star-half-alt"></i>`;
			}

			for (let i = 0; i < 5 - Math.ceil(rating); i++) {
				result += `<i class="far fa-star"></i>`;
			}

			return result;
		},
		removeQueryParamFromUrl(url: string, param: string) {
			const result = url.replace(new RegExp(`[&?]?${param}=[^&]*&?`), "");

			if (result.includes("?")) {
				return result.concat("&");
			}

			return result.concat("?");
		},
		removeQueryParamsFromUrl(url: string, ...params: [string]) {
			for (const param of params) {
				url.replace(new RegExp(`[&?]?${param}=[^&]*&?`), "");
			}

			if (url.includes("?")) {
				return url.concat("&");
			}

			return url.concat("?");
		},
		fullDateToShortDate(dateString: string) {
			const date = new Date(dateString);
			return date.toLocaleDateString("vi-VN");
		},
	},
});
app.engine("html", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

const allowOrigins = [
	"http://localhost:5173",
	"http://localhost:4173",
	"http://localhost:6969",
	"https://admin-fohoso.netlify.app",
];
app.use(
	cors({
		credentials: true,
		origin: allowOrigins,
	})
);
app.options("*", cors());

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
				imgSrc: [
					"http://localhost:8080/",
					"https://res.cloudinary.com",
					"https://fohoso-bookstore.tech",
					"data:",
				],
				formAction: ["*"],
			},
		},
	})
);

app.use(mongoSanitize());
app.use(xss());

app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

// Config response (add custom methods)
import requestConfig from "../commons/configs/request.config";
import responseConfig from "../commons/configs/response.config";
requestConfig(app);
responseConfig(app);

app.use(methodOverride("_method"));
app.use(flash());

// API routes
app.use("/api/v1", BaseRouter);
app.use("/", ViewRouter);

// Error handler
app.use(globalErrorHandler);

module.exports = app;
