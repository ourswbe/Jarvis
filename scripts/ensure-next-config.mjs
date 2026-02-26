import { existsSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const tsConfigPath = join(process.cwd(), 'next.config.ts');
const jsConfigPath = join(process.cwd(), 'next.config.js');

if (existsSync(tsConfigPath)) {
  if (!existsSync(jsConfigPath)) {
    renameSync(tsConfigPath, jsConfigPath);
    console.log('Renamed next.config.ts -> next.config.js');
  } else {
    console.warn('Found unsupported next.config.ts and existing next.config.js; remove next.config.ts manually.');
    process.exitCode = 1;
  }
}
