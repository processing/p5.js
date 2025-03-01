import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  generateTypeDefinitions
} from "./helper.js";

// Fix for __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/data.json')));

export function generateAllDeclarationFiles() {
  const { p5Types, globalTypes, fileTypes } = generateTypeDefinitions(data);
  
  const typesDir = path.join(process.cwd(), 'types');
  fs.mkdirSync(typesDir, { recursive: true });

  fs.writeFileSync(path.join(typesDir, 'p5.d.ts'), p5Types, 'utf8');
  fs.writeFileSync(path.join(typesDir, 'global.d.ts'), globalTypes, 'utf8');

  // Write file-specific type definitions
  fileTypes.forEach((content, filePath) => {
    const parsedPath = path.parse(filePath);
    const relativePath = path.relative(process.cwd(), filePath);
    const dtsPath = path.join(
      path.dirname(relativePath),
      `${parsedPath.name}.d.ts`
    );

    const exportName = parsedPath.name.replace('.', '_');
    const contentWithExport = content + `export default function ${exportName}(p5: any, fn: any): void;\n`;

    fs.mkdirSync(path.dirname(dtsPath), { recursive: true });
    fs.writeFileSync(dtsPath, contentWithExport, 'utf8');
    console.log(`Generated ${dtsPath}`);
  });
}

  generateAllDeclarationFiles();
