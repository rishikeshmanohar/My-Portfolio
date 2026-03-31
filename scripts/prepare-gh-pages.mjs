import { copyFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const docsDir = resolve('docs');
const indexPath = resolve(docsDir, 'index.html');
const notFoundPath = resolve(docsDir, '404.html');
const noJekyllPath = resolve(docsDir, '.nojekyll');

await copyFile(indexPath, notFoundPath);
await writeFile(noJekyllPath, '');

console.log('GitHub Pages artifacts prepared in docs/.');
