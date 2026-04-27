import { Request, Response } from "express";
import { db } from "../db";

export const recordUsage = async (req: Request, res: Response) => {
  try {
    const { userId, action, usedUnits } = req.body;

    const [result] = await db.execute(
      `INSERT INTO UsageRecords (userId, action, usedUnits)
       VALUES (?, ?, ?)`,
      [userId, action, usedUnits]
    );

    res.status(201).json({ message: "Usage recorded", result });
  } catch (err) {
    res.status(500).json({ error: "Error recording usage" });
  }
};

export const getCurrentUsage = async (req: Request, res: Response) => {
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

    const totalUsed = usageRows[0].total;

    const [planRows]: any = await db.execute(
      `SELECT p.*
       FROM Subscriptions s
       JOIN Plans p ON s.planId = p.id
       WHERE s.userId = ? AND s.isActive = true`,
      [userId]
    );

    const plan = planRows[0];

    const remaining = plan.monthlyQuota - totalUsed;

    res.json({
      totalUsed,
      remainingUnits: remaining < 0 ? 0 : remaining,
      plan,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching usage" });
  }
};