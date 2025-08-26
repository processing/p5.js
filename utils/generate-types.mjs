import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  generateTypeDefinitions
} from './helper.mjs';

// Fix for __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/data.json')));

function findDtsFiles(dir, files = []) {
  // Only search in src directory
  const srcDir = path.join(__dirname, '../types');
  if (!dir.startsWith(srcDir)) {
    dir = srcDir;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findDtsFiles(fullPath, files);
    } else if (entry.name.endsWith('.d.ts')) {
      // Get path relative to project root and normalize to forward slashes
      const relativePath = path.relative(path.join(__dirname, '../types'), fullPath)
        .split(path.sep)
        .join('/');
      files.push(relativePath);
    }
  }
  return files;
}

export function generateAllDeclarationFiles() {
  const { p5Types: rawP5Types, globalTypes, fileTypes } = generateTypeDefinitions(data);
  const typesDir = path.join(process.cwd(), 'types');
  fs.mkdirSync(typesDir, { recursive: true });

  // Write file-specific type definitions
  fileTypes.forEach((content, filePath) => {
    const parsedPath = path.parse(filePath);
    const relativePath = path.relative(
      path.join(__dirname, '../src'),
      filePath
    );
    const dtsPath = path.join(
      path.relative(process.cwd(), typesDir),
      path.dirname(relativePath),
      `${parsedPath.name}.d.ts`
    );

    const exportName = parsedPath.name.replace('.', '_');
    const contentWithExport = content + `export default function ${exportName}(p5: any, fn: any): void;\n`;

    fs.mkdirSync(path.dirname(dtsPath), { recursive: true });
    fs.writeFileSync(dtsPath, contentWithExport, 'utf8');
    console.log(`Generated ${dtsPath}`);
  });

  // Add .d.ts references to p5Types
  let p5Types = '// This file is auto-generated from JSDoc documentation\n\n';
  p5Types += '/// <reference types="./global.d.ts" />\n';

  // Add references to all other .d.ts files
  const dtsFiles = findDtsFiles(path.join(__dirname, '..'));
  for (const file of dtsFiles) {
    p5Types += `/// <reference path="./${file}" />\n`;
  }
  p5Types += '\n';
  p5Types += rawP5Types;

  fs.writeFileSync(path.join(typesDir, 'p5.d.ts'), p5Types, 'utf8');
  fs.writeFileSync(path.join(typesDir, 'global.d.ts'), globalTypes, 'utf8');
}

generateAllDeclarationFiles();
