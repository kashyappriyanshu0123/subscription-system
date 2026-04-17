import express from "express";
import { recordUsage } from "../controllers/usage.controller";
import { getBilling } from "../controllers/billing.controller";

const router = express.Router();

router.post("/usage", recordUsage);
router.get("/users/:id/billing-summary", getBilling);

export default router;