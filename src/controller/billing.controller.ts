import { Request, Response } from "express";
import { db } from "../db";

export const getBilling = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const [usageRows]: any = await db.execute(
      `SELECT COALESCE(SUM(usedUnits),0) as total
       FROM UsageRecords
       WHERE userId = ?
       AND MONTH(createdAt) = MONTH(CURRENT_DATE())
       AND YEAR(createdAt) = YEAR(CURRENT_DATE())`,
      [userId]
    );

    const totalUsage = usageRows[0].total;

    const [planRows]: any = await db.execute(
      `SELECT p.*
       FROM Subscriptions s
       JOIN Plans p ON s.planId = p.id
       WHERE s.userId = ? AND s.isActive = true`,
      [userId]
    );

    const plan = planRows[0];
    const quota = plan.monthlyQuota;

    let extraUnits = 0;
    let extraCharges = 0;

    if (totalUsage > quota) {
      extraUnits = totalUsage - quota;
      extraCharges = extraUnits * plan.extraChargePerUnit;
    }

    res.json({
      totalUsage,
      quota,
      extraUnits,
      extraCharges: Number(extraCharges.toFixed(2)),
      plan,
    });
  } catch (err) {
    res.status(500).json({ error: "Error calculating billing" });
  }
};