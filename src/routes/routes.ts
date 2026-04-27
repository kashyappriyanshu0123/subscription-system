import express from "express";
import { recordUsage, getCurrentUsage } from "../controller/usage.controller";
import { getBilling } from "../controller/billing.controller";
import { db } from "../db"; 

const router = express.Router();

router.post("/usage", recordUsage);
router.get("/users/:id/current-usage", getCurrentUsage);
router.get("/users/:id/billing-summary", getBilling);

router.delete("/usage/:id", async (req, res) => {
  try {
    const [result]: any = await db.execute(
      "DELETE FROM UsageRecords WHERE id = ?",
      [req.params.id]
    );

    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: "Error deleting record" });
  }
});

export default router;