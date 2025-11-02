import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mongodumpPath = path.join(__dirname, "..", "bin", "mongodump.exe");

// ✅ use consistent path style
const backupDir = path.join("D:", "DB_Backups_PharmaApp");

// Ensure folder exists
if (!fs.existsSync(backupDir)) {
  console.log("📂 Creating backup folder:", backupDir);
  fs.mkdirSync(backupDir, { recursive: true });
}

export function createBackup(req, res) {
  const backupFile = path.join(backupDir, "backup-latest.gz");

  // normalize to forward slashes (needed for mongodump on Windows)
  const normalizedBackupFile = backupFile.replace(/\\/g, "/");

  const command = `"${mongodumpPath}" --uri="mongodb://127.0.0.1:27017/PMS" --gzip --archive="${normalizedBackupFile}"`;

  console.log("⏳ Running backup with command:", command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Backup failed:", error.message);
      return res.status(500).json({
        success: false,
        message: "❌ Backup failed. Check server logs.",
        error: stderr,
      });
    }

    console.log(`✅ Backup saved at: ${normalizedBackupFile}`);
    return res.json({
      success: true,
      message: "✅ Backup completed successfully!",
      path: normalizedBackupFile,
    });
  });
}
