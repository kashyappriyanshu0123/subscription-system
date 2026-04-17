import { db } from "../config/db";

export const addUsage = async (
  userId: number,
  action: string,
  usedUnits: number
) => {
  await db.query(
    "INSERT INTO UsageRecords (userId, action, usedUnits) VALUES (?, ?, ?)",
    [userId, action, usedUnits]
  );
};

export const getMonthlyUsage = async (userId: number) => {
  const [rows]: any = await db.query(
    `SELECT SUM(usedUnits) as totalUsed
     FROM UsageRecords
     WHERE userId = ? AND MONTH(createdAt) = MONTH(CURRENT_DATE())`,
    [userId]
  );

  return rows[0].totalUsed || 0;
};