import { Express, Request, Response } from "express";

export default function (app: Express) {
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
}
