import { execSync } from 'child_process';

const remote = process.argv[2] || 'origin';
const branch = execSync('git rev-parse --abbrev-ref HEAD', {
  encoding: 'utf8',
})
  .trim();

if (branch === 'HEAD') {
  console.error('Detached HEAD: cannot push version bump automatically.');
  process.exit(1);
}

execSync('node scripts/up-version.js', { stdio: 'inherit' });
execSync(`git push --no-verify "${remote}" "HEAD:refs/heads/${branch}"`, {
  stdio: 'inherit',
});

console.log('Push completed with service worker version bump included.');
