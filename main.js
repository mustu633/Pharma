import { app, BrowserWindow } from 'electron';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'frontend', 'build', 'index.html'));

  // === Correct path to node.exe inside asar.unpacked ===
  const resourcesPath = process.resourcesPath;
  const nodePath = path.join(resourcesPath, 'app.asar.unpacked', 'backend', 'node-runtime', 'node.exe');
  const backendScript = path.join(resourcesPath, 'app.asar.unpacked', 'backend', 'index.js');

  console.log('Starting backend...');
  console.log('Using nodePath:', nodePath);
  console.log('Using backendScript:', backendScript);

  backendProcess = spawn(nodePath, [backendScript], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
    },
  });

  backendProcess.on('exit', (code) => {
    console.log(`Backend exited with code ${code}`);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
