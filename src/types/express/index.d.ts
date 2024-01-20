import { IUser } from "../../models/user.model";
import { IOrder } from "../../models/order.model";

declare global {
	namespace Express {
		interface Request {
			user: IUser;
			order: IOrder;
		}
	}
}
