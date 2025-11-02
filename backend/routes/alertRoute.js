import express from "express";
import checkStockLevels from "../utils/stockAlert.js";
import checkExpiryLevels from "../utils/expiryAlert.js";

const alertRouter = express.Router();

//for low stock alert

alertRouter.get("/stock-alerts", async (req, res) => {
  try {
    const lowStockProducts = await checkStockLevels();
    res.status(200).json({ success: true, lowStockProducts });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve stock alerts" });
  }
});

// for expiry alert

alertRouter.get("/expiry-alerts", async (req, res) => {
  try {
    const nearexpiryProducts = await checkExpiryLevels();
    res.status(200).json({ success: true, nearexpiryProducts });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve expiry alerts" });
  }
});

export default alertRouter;
