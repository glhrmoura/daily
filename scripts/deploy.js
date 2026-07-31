import { execSync, spawnSync } from 'child_process';

execSync('node scripts/up-version.js', { stdio: 'inherit' });

const extraArgs = process.argv.slice(2);
const pushArgs =
  extraArgs.length > 0
    ? ['push', ...extraArgs]
    : ['push', '--set-upstream', 'origin', 'HEAD'];

const result = spawnSync('git', pushArgs, {
  stdio: 'inherit',
});

process.exit(result.status === null ? 1 : result.status);
