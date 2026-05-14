import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

console.log("🧹 Tizim tozalanmoqda (Loglar va eski jarayonlar)...");

// Delete old log files
try {
  const logs = fs.readdirSync(process.cwd()).filter(f => f.endsWith('.log'));
  logs.forEach(f => {
    try { fs.unlinkSync(path.join(process.cwd(), f)); } catch(e) {}
  });
} catch (e) {}

try {
  if (process.platform === 'win32') {
    // Kill ANY node process that might be a bot (matching "bot" or "vite" in command line)
    execSync('powershell "Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like \'*bot*\' -or $_.CommandLine -like \'*vite*\' } | Stop-Process -Force"', { stdio: 'ignore' });
  }
} catch (e) {}

console.log("🚀 Hammasi toza! Sayt va Bot ishga tushirilmoqda...");

const vite = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });
const bot = spawn('node', ['bot.js'], { stdio: 'inherit', shell: true });

vite.on('close', (code) => {
  console.log(`Vite exited with code ${code}`);
  process.exit(code);
});

bot.on('close', (code) => {
  console.log(`Bot exited with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  vite.kill('SIGINT');
  bot.kill('SIGINT');
  process.exit();
});
