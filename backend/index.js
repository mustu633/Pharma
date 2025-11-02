import express from "express";
import { dbConnection } from "./db/mongo.js";
import cors from "cors";
import dotenv from "dotenv";
import productRouter from "./routes/productRoute.js";
import saleRouter from "./routes/saleRoute.js";
import userRouter from "./routes/authRoutes.js";
import supplierRouter from "./routes/supplierRoute.js";
import purchaseRouter from "./routes/purchaseRoute.js";
import alertRouter from "./routes/alertRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import invoiceRouter from "./routes/invoiceRoute.js";
import { createBackup } from "./utils/backup.js";

console.log("🚀 index.js starting...");

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, "config/.env");

console.log(`🛠️ Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

console.log("🧪 MONGO_URI:", process.env.MONGO_URI);
console.log("🧪 PORT:", process.env.PORT);

(async () => {
  try {
    await dbConnection();
    console.log("✅ Connected to DB");

    const app = express();

    const corsOption = {
      origin: "http://localhost:3000",
      credentials: true,
      optionSuccessStatus: 200,
    };
    app.use(cors(corsOption));

    // app.use(
    //   cors({
    //     origin: function (origin, callback) {
    //       if (!origin || origin.startsWith("file://")) {
    //         callback(null, true);
    //       } else {
    //         callback(new Error("Not allowed by CORS"));
    //       }
    //     },
    //     credentials: true,
    //   })
    // );

    app.use(express.json());

    app.use("/api/products", productRouter);
    app.use("/api/sales", saleRouter);
    app.use("/api/users", userRouter);
    app.use("/api/suppliers", supplierRouter);
    app.use("/api/purchases", purchaseRouter);
    app.use("/api/alert", alertRouter);
    app.use("/api/invoices", invoiceRouter);

    // Manual backup route
    app.post("/api/backup", (req, res) => {
      console.log("⏳ Manual backup requested...");
      createBackup(req, res); // <-- pass req, res properly
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Fatal error starting backend:", err);
  }
})();
