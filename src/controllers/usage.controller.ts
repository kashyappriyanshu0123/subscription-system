import { Request, Response } from "express";
import { addUsage } from "../models/usage.model";

export const recordUsage = async (req: Request, res: Response) => {
  try {
    const { userId, action, usedUnits } = req.body;

    await addUsage(userId, action, usedUnits);

    res.json({ message: "Usage recorded" });
  } catch (error) {
  console.log(error);   
  res.status(500).json({ error: "Something went wrong" });
}
};
