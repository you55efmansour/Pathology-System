import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import process from 'node:process';
import console from 'node:console';

const project = fileURLToPath(new URL('../', import.meta.url));
const repository = 'https://github.com/you55efmansour/Pathology-System.git';
const destination = mkdtempSync(join(tmpdir(), 'histora-pages-'));
const git = (args, cwd = destination) => execFileSync('git', ['-c', `safe.directory=${cwd.replaceAll('\\', '/')}`, ...args], { cwd, stdio: 'inherit' });

process.env.VITE_GITHUB_PAGES = 'true';
process.env.VITE_BASE_PATH = '/Pathology-System/';
const { build } = await import('vite');
await build({ root: project });
cpSync(join(project, 'dist'), destination, { recursive: true });
writeFileSync(join(destination, '.nojekyll'), '');
git(['init', '-b', 'gh-pages']);
git(['remote', 'add', 'origin', repository]);
const existing = execFileSync('git', ['ls-remote', '--heads', repository, 'gh-pages'], { cwd: destination, encoding: 'utf8' }).trim();
if (existing) {
  git(['fetch', 'origin', 'gh-pages']);
  git(['update-ref', 'refs/heads/gh-pages', 'refs/remotes/origin/gh-pages']);
}
git(['add', '--all']);
git(['-c', 'user.name=Histora deployment', '-c', 'user.email=deployment@users.noreply.github.com', 'commit', '--allow-empty', '-m', 'Deploy tested pathology workspace']);
git(['push', 'origin', 'gh-pages']);
console.log('Published files: https://you55efmansour.github.io/Pathology-System/');
