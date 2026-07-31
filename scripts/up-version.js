import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const pkgPath = path.join(process.cwd(), 'package.json');
const swPath = path.join(process.cwd(), 'public', 'sw.js');

try {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const current = pkg.version || '0.0.0';
  const parts = current.split('.').map(Number);
  parts[2] = (parts[2] || 0) + 1;
  const newVersion = parts.join('.');

  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');

  const swContent = fs.readFileSync(swPath, 'utf8');
  if (!/const APP_VERSION = ['"][^'"]+['"];/.test(swContent)) {
    console.error('Could not find APP_VERSION in sw.js');
    process.exit(1);
  }

  const updatedSw = swContent.replace(
    /const APP_VERSION = ['"][^'"]+['"];/,
    `const APP_VERSION = '${newVersion}';`,
  );
  fs.writeFileSync(swPath, updatedSw, 'utf8');

  console.log(`Version ${current} → ${newVersion}`);

  execSync('git add package.json public/sw.js');
  if (fs.existsSync(path.join(process.cwd(), 'yarn.lock'))) {
    execSync('git add yarn.lock');
  }
  if (fs.existsSync(path.join(process.cwd(), 'package-lock.json'))) {
    execSync('git add package-lock.json');
  }
  execSync(`git commit -m "chore: bump version to ${newVersion}"`);
} catch (error) {
  console.error('Failed to bump version:', error.message);
  process.exit(1);
}
