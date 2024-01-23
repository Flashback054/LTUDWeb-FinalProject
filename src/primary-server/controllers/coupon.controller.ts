import Coupon from "../models/coupon.model";
import ControllerFactory from "../../commons/controllers/controller.factory";

export const getAllCoupons = ControllerFactory.getAll(Coupon);
export const getCoupon = ControllerFactory.getOne(Coupon);
export const createCoupon = ControllerFactory.createOne(Coupon);
export const updateCoupon = ControllerFactory.updateOne(Coupon);
export const deleteCoupon = ControllerFactory.deleteOne(Coupon);
