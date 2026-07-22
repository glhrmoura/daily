import { execSync } from 'child_process';

execSync('node scripts/up-version.js', { stdio: 'inherit' });
execSync('git push --no-verify', { stdio: 'inherit' });
