let parentEl = document.body;
let skipping = false;
let setups = [];
let teardowns = [];
const tests = [];

window.devicePixelRatio = 1;

// Force default antialiasing to match Chrome in puppeteer
const origSetAttributeDefaults = p5.RendererGL.prototype._setAttributeDefaults;
p5.RendererGL.prototype._setAttributeDefaults = function(pInst) {
  origSetAttributeDefaults(pInst);
  pInst._glAttributes = Object.assign({}, pInst._glAttributes);
  pInst._glAttributes.antialias = true;
};

window.suite = function(name, callback) {
  const prevSetups = setups;
  const prevTeardowns = teardowns;
  const prevParent = parentEl;
  const suiteEl = document.createElement('div');
  suiteEl.classList.add('suite');
  const title = document.createElement('h4');
  title.innerText = decodeURIComponent(name);
  suiteEl.appendChild(title);
  parentEl.appendChild(suiteEl);

  parentEl = suiteEl;
  setups = [...setups];
  teardowns = [...teardowns];
  callback();

  parentEl = prevParent;
  setups = prevSetups;
  teardowns = prevTeardowns;
  return suiteEl;
};
window.suite.skip = function(name, callback) {
  const prevSkipping = skipping;
  skipping = true;
  const el = window.suite(name, callback);
  el.classList.add('skipped');
  skipping = prevSkipping;
};
window.suite.only = function(name, callback) {
  const el = window.suite(name, callback);
  el.classList.add('focused');
};

window.setup = function(cb) {
  if (!cb) return;
  setups.push(cb);
};

window.teardown = function(cb) {
  if (!cb) return;
  teardowns.push(cb);
};

window.test = function(_name, callback) {
  const testEl = document.createElement('div');
  testEl.classList.add('test');
  parentEl.appendChild(testEl);
  const currentParent = parentEl;
  const testSetups = setups;
  const testTeardowns = teardowns;
  if (!skipping) {
    tests.push(async function() {
      const prevCheckMatch = window.checkMatch;
      window.checkMatch = function(actual, expected, p5) {
        let { ok, diff } = prevCheckMatch(actual, expected, p5);

        const screenshot = document.createElement('div');
        screenshot.classList.add('screenshot');
        const actualPreview = document.createElement('img');
        actualPreview.setAttribute('src', actual.canvas.toDataURL());
        actualPreview.setAttribute('title', 'Received');
        const expectedPreview = document.createElement('img');
        expectedPreview.setAttribute('src', expected.canvas.toDataURL());
        expectedPreview.setAttribute('title', 'Expected');
        const diffPreview = document.createElement('img');
        diffPreview.setAttribute('src', diff.canvas.toDataURL());
        diffPreview.setAttribute('title', 'Difference');
        diffPreview.classList.add('diff');
        screenshot.appendChild(actualPreview);
        screenshot.appendChild(expectedPreview);
        screenshot.appendChild(diffPreview);
        if (!ok) {
          screenshot.classList.add('failed');
          currentParent.classList.add('failed');
        }
        testEl.appendChild(screenshot);
        return { ok, diff };
      };
      try {
        for (const setup of testSetups) {
          await setup();
        }
        await callback();
      } catch (e) {
        if (!(e instanceof ScreenshotError)) {
          const p = document.createElement('p');
          p.innerText = e.toString();
          testEl.appendChild(p);
        }
        testEl.classList.add('failed');
      }
      for (const teardown of testTeardowns) {
        await teardown();
      }
      window.checkMatch = prevCheckMatch;
    });
  }
};

window.addEventListener('load', async function() {
  for (const test of tests) {
    await test();
  }

  const numTotal = document.querySelectorAll('.test').length;
  const numFailed = document.querySelectorAll('.test.failed').length;
  document.getElementById('metrics').innerHTML =
    `${numTotal - numFailed} passed out of ${numTotal}`;
});
