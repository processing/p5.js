suite('preloads', () => {
  let preloadCache = null;
  setup(() => {
    preloadCache = p5.prototype._promisePreloads;
    p5.prototype._promisePreloads = [...preloadCache];
  });

  teardown(() => {
    p5.prototype._promisePreloads = preloadCache;
  });

  suite('From external sources', () => {
    test('Extension preload causes setup to wait', () => {
      let resolved = false;
      const target = {
        async testPreloadFunction() {
          await new Promise(res => setTimeout(res, 10));
          resolved = true;
        }
      };

      p5.prototype._promisePreloads.push({
        target,
        method: 'testPreloadFunction'
      });

      return promisedSketch((sketch, resolve, reject) => {
        sketch.preload = () => {
          target.testPreloadFunction();
        };

        sketch.setup = () => {
          if (resolved) {
            resolve();
          } else {
            reject(new Error('Sketch enetered setup too early.'));
          }
        };
      });
    });

    test('Extension preload error causes setup to not execute', () => {
      const target = {
        async testPreloadFunction() {
          throw new Error('Testing Error');
        }
      };

      p5.prototype._promisePreloads.push({
        target,
        method: 'testPreloadFunction'
      });

      return promisedSketch((sketch, resolve, reject) => {
        sketch.preload = () => {
          target.testPreloadFunction();
          setTimeout(resolve, 10);
        };

        sketch.setup = () => {
          reject('Sketch should not enter setup');
        };
      });
    });

    suite('addCallbacks', () => {
      test('Extension is passed all arguments when not using addCallbacks', () => {
        const target = {
          async testPreloadFunction(...args) {
            assert.lengthOf(args, 3);
          }
        };

        p5.prototype._promisePreloads.push({
          target,
          method: 'testPreloadFunction',
          addCallbacks: false
        });

        return promisedSketch((sketch, resolve, reject) => {
          sketch.preload = () => {
            target
              .testPreloadFunction(() => {}, () => {}, () => {})
              .catch(reject);
          };

          sketch.setup = resolve;
        });
      });

      test('Extension gets stripped arguments when using addCallbacks', () => {
        const target = {
          async testPreloadFunction(...args) {
            assert.lengthOf(args, 1);
          }
        };

        p5.prototype._promisePreloads.push({
          target,
          method: 'testPreloadFunction',
          addCallbacks: true
        });

        return promisedSketch((sketch, resolve, reject) => {
          sketch.preload = () => {
            target
              .testPreloadFunction(() => {}, () => {}, () => {})
              .catch(reject);
          };

          sketch.setup = resolve;
        });
      });

      test('Extension with addCallbacks supports success callback', () => {
        const target = {
          async testPreloadFunction(...args) {
            assert.lengthOf(args, 1);
          }
        };

        p5.prototype._promisePreloads.push({
          target,
          method: 'testPreloadFunction',
          addCallbacks: true
        });

        let success = 0;

        return promisedSketch((sketch, resolve, reject) => {
          sketch.preload = () => {
            target
              .testPreloadFunction(0, () => {
                success++;
              })
              .catch(reject);
            target
              .testPreloadFunction(
                () => {},
                () => {
                  success++;
                },
                () => {
                  reject(new Error('Failure callback executed'));
                }
              )
              .catch(reject);
          };

          sketch.setup = () => {
            if (success !== 2) {
              reject(
                new Error(`Not all success callbacks were run: ${success}/2`)
              );
            }
            resolve();
          };
        });
      });
    });

    suite('legacyPreload', () => {
      test('Extension legacy preload causes setup to wait', () => {
        let resolved = false;
        const target = {
          async testPreloadFunction() {
            await new Promise(res => setTimeout(res, 10));
            resolved = true;
          }
        };

        p5.prototype._promisePreloads.push({
          target,
          method: 'testPreloadFunction',
          legacyPreloadSetup: {
            method: 'testPreloadLegacy'
          }
        });

        return promisedSketch((sketch, resolve, reject) => {
          sketch.preload = () => {
            target.testPreloadLegacy();
          };

          sketch.setup = () => {
            if (resolved) {
              resolve();
            } else {
              reject(new Error('Sketch enetered setup too early.'));
            }
          };
        });
      });

      test('Extension legacy preload error causes setup to not execute', () => {
        const target = {
          async testPreloadFunction() {
            throw new Error('Testing Error');
          }
        };

        p5.prototype._promisePreloads.push({
          target,
          method: 'testPreloadFunction',
          legacyPreloadSetup: {
            method: 'testPreloadLegacy'
          }
        });

        return promisedSketch((sketch, resolve, reject) => {
          sketch.preload = () => {
            target.testPreloadLegacy();
            setTimeout(resolve, 10);
          };

          sketch.setup = () => {
            reject('Sketch should not enter setup');
          };
        });
      });

      test('Extension legacy preload returns objects correctly', async () => {
        let testItem = {
          test: true,
          otherTest: []
        };
        const target = {
          async testPreloadFunction() {
            return testItem;
          }
        };

        p5.prototype._promisePreloads.push({
          target,
          method: 'testPreloadFunction',
          legacyPreloadSetup: {
            method: 'testPreloadLegacy'
          }
        });

        let testResult;

        await promisedSketch((sketch, resolve, reject) => {
          sketch.preload = () => {
            testResult = target.testPreloadLegacy();
          };

          sketch.setup = resolve();
        });

        assert.deepEqual(testResult, testItem);
      });

      test('Extension legacy preload returns arrays correctly', async () => {
        let testItem = [true, [], {}];
        const target = {
          async testPreloadFunction() {
            return testItem;
          }
        };

        p5.prototype._promisePreloads.push({
          target,
          method: 'testPreloadFunction',
          legacyPreloadSetup: {
            method: 'testPreloadLegacy',
            createBaseObject: () => []
          }
        });

        let testResult;

        await promisedSketch((sketch, resolve, reject) => {
          sketch.preload = () => {
            testResult = target.testPreloadLegacy();
          };

          sketch.setup = resolve();
        });

        assert.deepEqual(testResult, testItem);
      });
    });
  });
});
