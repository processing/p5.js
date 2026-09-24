import p5 from '../../../src/app.js';

suite('Version', function () {
  var myp5;

  beforeAll(function () {
    new p5(function (p) {
      p.setup = function () {
        myp5 = p;
      };
    });
  });

  afterAll(function () {
    myp5.remove();
  });

  test('exists on p5 object', function () {
    assert.isString(p5.VERSION);
    // ensure the string isn't empty
    assert.isTrue(p5.VERSION.length > 0);
  });

  test('uses a build-time placeholder instead of a hardcoded version', function () {
    // The real version is substituted into the bundle at build time from
    // package.json. Keeping the placeholder here means there is a single
    // source of truth for the version, which utils/check-version.mjs verifies.
    assert.equal(p5.VERSION, 'VERSION_WILL_BE_REPLACED_BY_BUILD');
  });

  test('exists on instance of p5 sketch', function () {
    assert.isString(myp5.VERSION);
    // ensure the string isn't empty
    assert.isTrue(myp5.VERSION.length > 0);
  });
});
