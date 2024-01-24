import { IUser } from "../../../primary-server/models/user.model";
import { IOrder } from "../../../primary-server/models/order.model";
import { RequestOptions } from "https";

interface IRequestToServer {
	toPrimaryServer: (url: string, options: any) => Promise<any>;
	toPaymentServer: (url: string, options: any) => Promise<any>;
}
declare global {
	namespace Express {
		interface Request {
			user: IUser;
			order: IOrder;
			request: IRequestToServer;
		}

		interface Response {
			ok: (data: any) => void;
			created: (data: any) => void;
			noContent: () => void;
			badRequest: (error: any) => void;
			unauthorized: (error: any) => void;
			forbidden: (error: any) => void;
			notFound: (error: any) => void;

			// Custom error
			error: (error: any) => void;
		}
	}
}
