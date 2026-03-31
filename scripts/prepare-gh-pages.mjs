import { copyFile, cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const browserDir = resolve('dist', 'my-portfolio', 'browser');
const docsDir = resolve('docs');

await rm(docsDir, { recursive: true, force: true });
await mkdir(docsDir, { recursive: true });
await cp(browserDir, docsDir, { recursive: true });

const indexPath = resolve(docsDir, 'index.html');
const notFoundPath = resolve(docsDir, '404.html');
await copyFile(indexPath, notFoundPath);
await writeFile(resolve(docsDir, '.nojekyll'), '');

console.log('GitHub Pages artifacts prepared in docs/ from dist/my-portfolio/browser.');
