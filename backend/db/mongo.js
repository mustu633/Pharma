import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "PMS",
    });
    console.log("✅ Connected to DB");
  } catch (err) {
    console.log(`❌ DB connection error: ${err}`);
    throw err;
  }
};
