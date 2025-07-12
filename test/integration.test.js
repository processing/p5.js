const { execSync } = require('node:child_process');
const { resolve } = require('node:path');

function run(project, cmd) {
  const proj = resolve(__dirname, 'integrations', project);
  console.log(`\n▶️  ${project.toUpperCase()} type checking…`);
  // install deps (npm install works even without a lockfile)
  execSync('npm install --silent --no-audit --no-fund', {
    cwd: proj,
    stdio: 'inherit'
  });
  // run the project’s type‑check command
  execSync(cmd, { cwd: proj, stdio: 'inherit' });
  console.log(`✅  ${project} declarations compile successfully`);
}

run('typescript', 'npx tsc --noEmit');
run('react', 'npm run typecheck --silent');
run('vuejs', 'npm run typecheck --silent');
