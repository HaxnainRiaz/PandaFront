import { realpathSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// On Windows, PowerShell can retain user-entered directory casing. Next.js uses
// case-sensitive module cache keys, so mixed `webstore`/`WebStore` paths can
// create duplicate async-storage modules and break static prerendering.
const projectRoot = realpathSync.native(process.cwd());
const nextCli = path.join(projectRoot, 'node_modules', 'next', 'dist', 'bin', 'next');

const result = spawnSync(process.execPath, [nextCli, 'build'], {
  cwd: projectRoot,
  env: process.env,
  stdio: 'inherit',
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
