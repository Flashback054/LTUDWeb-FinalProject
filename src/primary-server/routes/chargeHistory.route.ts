import { Router } from "express";
import * as ChargeHistoryController from "../controllers/chargeHistory.controller";
import * as AuthController from "../controllers/auth.controller";

const router = Router();

router.use(AuthController.protect);

router.get("/", ChargeHistoryController.getAllChargeHistories);
router.get("/:id", ChargeHistoryController.getChargeHistory);
router.post("/", ChargeHistoryController.createChargeHistory);

export default router;
