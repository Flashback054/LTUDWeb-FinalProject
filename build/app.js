"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
require("express-async-errors");
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var helmet_1 = __importDefault(require("helmet"));
var express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
var xss_clean_1 = __importDefault(require("xss-clean"));
var compression_1 = __importDefault(require("compression"));
var cors_1 = __importDefault(require("cors"));
var error_controller_1 = __importDefault(require("./controllers/error.controller"));
// Import routers
var book_route_1 = __importDefault(require("./routes/book.route"));
var user_route_1 = __importDefault(require("./routes/user.route"));
var order_route_1 = __importDefault(require("./routes/order.route"));
var auth_route_1 = __importDefault(require("./routes/auth.route"));
var payment_route_1 = __importDefault(require("./routes/payment.route"));
var statistic_route_1 = __importDefault(require("./routes/statistic.route"));
var category_route_1 = __importDefault(require("./routes/category.route"));
var review_route_1 = __importDefault(require("./routes/review.route"));
var app = (0, express_1.default)();
// Trust proxy
app.enable("trust proxy");
// CORS;
var allowOrigins = ["http://localhost:5173", "http://localhost:4173"];
app.use((0, cors_1.default)({
    credentials: true,
    origin: allowOrigins,
}));
// Implement CORS on all OPTIONS request
// Browser send OPTIONS req on preflight phase (before non-simple req like PUT,PATCH,DELETE,...)
// -> inorder to verify that the non-simple req is safe to perform
// -> we must set CORS on response
app.options("*", (0, cors_1.default)());
//////// IMPORTANT : helmet should be used in every Express app
// Security HTTP headers
app.use((0, helmet_1.default)({
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
}));
//////// IMPORTANT ////////
// Data sanitization against NoSQL query injection
app.use((0, express_mongo_sanitize_1.default)());
// Data sanitization against XSS
// replace malicious HTML code : ex : <div id='error-code'></div> -> &lt;div id='error-code'&gt;...
app.use((0, xss_clean_1.default)());
// compress all the response text (ex: JSON or HTML)
app.use((0, compression_1.default)());
// Body parser
app.use(express_1.default.json());
// Cookie parser
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// Set static files
app.use(express_1.default.static("".concat(__dirname, "/public")));
// Routes
app.use("/api/v1/users", user_route_1.default);
app.use("/api/v1/books", book_route_1.default);
app.use("/api/v1/orders", order_route_1.default);
app.use("/api/v1/auth", auth_route_1.default);
app.use("/api/v1/payments", payment_route_1.default);
app.use("/api/v1/statistics", statistic_route_1.default);
app.use("/api/v1/categories", category_route_1.default);
app.use("/api/v1/reviews", review_route_1.default);
// Error handler
app.use(error_controller_1.default);
module.exports = app;
//# sourceMappingURL=app.js.map