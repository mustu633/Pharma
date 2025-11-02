import Product from "../models/productSchema.js";

const checkExpiryLevels = async () => {
  try {
    const today = new Date();
    const sevenMonthsLater = new Date();
    sevenMonthsLater.setMonth(sevenMonthsLater.getMonth() + 7);

    const nearexpiryProducts = await Product.find({
      expiryDate: { $gte: today, $lte: sevenMonthsLater }
    });

    return nearexpiryProducts;
  } catch (error) {
    console.error("Error Checking Expiry Levels:", error);
  }
};

export default checkExpiryLevels;
