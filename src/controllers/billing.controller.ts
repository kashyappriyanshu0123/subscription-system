import { Request, Response } from "express";
import { db } from "../config/db";
import { getMonthlyUsage } from "../models/usage.model";

export const getBilling = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    const usage = await getMonthlyUsage(userId);

    const [sub]: any = await db.query(
      `SELECT p.monthlyQuota, p.extraChargePerUnit
       FROM Subscriptions s
       JOIN Plans p ON s.planId = p.id
       WHERE s.userId = ? AND s.isActive = true`,
      [userId]
    );

    const plan = sub[0];

    const extraUnits = Math.max(0, usage - plan.monthlyQuota);
    const extraCharges = extraUnits * plan.extraChargePerUnit;

    res.json({
      totalUsage: usage,
      quota: plan.monthlyQuota,
      extraUnits,
      extraCharges,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};