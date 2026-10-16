const yaml = require('js-yaml');
const fs = require('fs');

const yamlData = fs.readFileSync('stewards.yml', 'utf8');
const parsed = yaml.load(yamlData);

const areaMap = {};
const supportedi18n = new Set(['hi', 'ko', 'zh', 'es']);


for (const [user, roles] of Object.entries(parsed)) {
  roles.forEach(role => {
    if (typeof role === 'string') {
      areaMap[role] = areaMap[role] || new Set();
      areaMap[role].add(`${user}`);
    } else {
      for (const [main, subs] of Object.entries(role)) {
        subs.forEach(sub => {
          if (main === 'i18n' && !supportedi18n.has(sub)) return;
          const key = `${main} (${sub})`;
          areaMap[key] = areaMap[key] || new Set();
          areaMap[key].add(`${user}`);
        });
      }
    }
  });
}


const startMarker = '<!-- STEWARDS-LIST:START - Do not remove or modify this section -->';
const endMarker = '<!-- STEWARDS-LIST:END -->';

const header = '| Area | Steward(s) |';
const divider = '|------|-------------|';

const sortedEntries = Object.entries(areaMap).sort(([aKey], [bKey]) => {
  if (aKey === 'Maintainers') return -1;
  if (bKey === 'Maintainers') return 1;
  return aKey.localeCompare(bKey);
});

const rows = sortedEntries.map(([area, users]) => `| ${area} | ${[...users].sort().map(
  u => `[@${u}](https://github.com/${u})`
).join(', ')} |`).join('\n');
const newTable = [startMarker, header, divider, rows, endMarker].join('\n');

let readme = fs.readFileSync('README.md', 'utf8');

const startIndex = readme.indexOf(startMarker);
const endIndex = readme.indexOf(endMarker) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
  readme = readme.slice(0, startIndex) + newTable + readme.slice(endIndex);
}

fs.writeFileSync('README.md', readme);
