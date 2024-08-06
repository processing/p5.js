// List all visual test files here that should be manually run
const visualTestList = ['webgl', 'typography'];

for (const file of visualTestList) {
  document.write(
    `<script src="unit/visual/cases/${file}.js" type="text/javascript"></script>`
  );
}
