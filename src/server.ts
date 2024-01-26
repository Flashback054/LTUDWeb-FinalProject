import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

// Catch SYNC Exception (like using unknown variable,...)
process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT EXCEPTION! Shutting down server...");
	console.log(err.name, ": ", err.message);
	console.log("Stack: ", err.stack);
	process.exit(1);
});

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const DB = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);

let server;
let paymentServer;
mongoose.connect(DB).then(async (con) => {
	console.log("Connect to DB successfully.");

	// /* eslint-disable global-require */
	const app = require("./primary-server/app");
	const paymentApp = require("./payment-server/app");
	// /* eslint-enable global-require */

	const PORT = process.env.PORT || 8080;

	server = app.listen(PORT, "0.0.0.0", () => {
		console.log(`Server started! Listening on port ${PORT}`);
	});
	paymentServer = paymentApp.listen(
		process.env.PAYMENT_SERVER_PORT || 6969,
		"0.0.0.0",
		() => {
			console.log(
				`Payment server started! Listening on port ${process.env.PAYMENT_SERVER_PORT}`
			);
		}
	);
});

// Catch ASYNC Rejection (like failed DB connection,...)
process.on("unhandledRejection", (err: Error) => {
	console.log("UNHANDLE REJECTION! Shutting down server...");
	console.log(err.name, ": ", err.message);
	console.log("Stack:", err.stack);
	// Give server time to complete req currently being processed
	if (server)
		server.close(() => {
			// process.exit(0) : success, (1) : error
			process.exit(1);
		});
});
