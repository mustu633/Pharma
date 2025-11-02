import cron from "node-cron";
import { runBackup } from "./utils/backup.js";

// Run backup every day at 2 AM
cron.schedule("0 2 * * *", () => {
  console.log("⏳ Running daily backup...");
  runBackup();
});
