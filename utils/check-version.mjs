import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from '../package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const placeholder = 'VERSION_WILL_BE_REPLACED_BY_BUILD';
const expected = pkg.version;
const bundles = ['lib/p5.js', 'lib/p5.min.js', 'lib/p5.esm.js', 'lib/p5.esm.min.js'];

const errors = [];

for (const rel of bundles) {
  const file = path.join(__dirname, '..', rel);
  if (!fs.existsSync(file)) {
    errors.push(`${rel} is missing. Run \`npm run build\` first.`);
    continue;
  }

  const source = fs.readFileSync(file, 'utf-8');

  if (source.includes(placeholder)) {
    errors.push(
      `${rel} still contains the build placeholder '${placeholder}' and was never replaced by the build.`
    );
  }

  const declared = source.match(/VERSION = "([^"]+)"/);
  if (declared && declared[1] !== expected) {
    errors.push(
      `${rel} declares VERSION "${declared[1]}" but package.json says "${expected}".`
    );
  } else if (!source.includes(expected)) {
    errors.push(
      `${rel} does not embed version "${expected}". Expected the build to substitute it.`
    );
  }
}

if (errors.length > 0) {
  console.error(`Version check failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`Version check passed. All bundles embed p5.js v${expected}.`);