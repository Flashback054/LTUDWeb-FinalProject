import { IUser } from "../../models/user.model";
import { IOrder } from "../../models/order.model";

declare global {
	namespace Express {
		interface Request {
			user: IUser;
			order: IOrder;
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
