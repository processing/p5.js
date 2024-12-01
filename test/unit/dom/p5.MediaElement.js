import { vi } from 'vitest';
import { mockP5, mockP5Prototype } from '../../js/mocks';
import { default as media, MediaElement } from '../../../src/dom/p5.MediaElement';
import { Element } from '../../../src/dom/p5.Element';

suite('p5.MediaElement', () => {
  beforeAll(() => {
    media(mockP5, mockP5Prototype);
    navigator.mediaDevices.getUserMedia = vi.fn()
      .mockResolvedValue("stream-value");
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  suite('p5.prototype.createVideo', function() {
    afterEach(function() {
      document.body.innerHTML = "";
    });

    const mediaSources = [
      '/test/unit/assets/nyan_cat.gif',
      '/test/unit/assets/target.gif'
    ];

    test('should be a function', function() {
      assert.isFunction(mockP5Prototype.createVideo);
    });

    test('should return p5.Element of HTMLVideoElement', function() {
      const testElement = mockP5Prototype.createVideo('');
      assert.instanceOf(testElement, MediaElement);
      assert.instanceOf(testElement.elt, HTMLVideoElement);
    });

    test('should accept a singular media source', function() {
      const mediaSource = mediaSources[0];
      const testElement = mockP5Prototype.createVideo(mediaSource);
      const sourceEl = testElement.elt.children[0];

      assert.deepEqual(testElement.elt.childElementCount, 1);
      assert.instanceOf(sourceEl, HTMLSourceElement);
      assert.isTrue(sourceEl.src.endsWith(mediaSource));
    });

    test('should accept multiple media sources', function() {
      const testElement = mockP5Prototype.createVideo(mediaSources);

      assert.deepEqual(testElement.elt.childElementCount, mediaSources.length);
      for (let index = 0; index < mediaSources.length; index += 1) {
        const sourceEl = testElement.elt.children[index];
        assert.instanceOf(sourceEl, HTMLSourceElement);
        assert.isTrue(sourceEl.src.endsWith(mediaSources[index]));
      }
    });

    // testSketchWithPromise(
    //   'should trigger callback on canplaythrough event',
    //   function(sketch, resolve, reject) {
    //     sketch.setup = function() {
    //       testElement = myp5.createVideo(mediaSources, resolve);
    //       testElement.elt.dispatchEvent(new Event('canplaythrough'));
    //     };
    //   }
    // );

    // TODO: integration test
    test.todo('should work with tint()', function(done) {
      const imgElt = myp5.createImg('/test/unit/assets/cat.jpg', '');
      const testElement = myp5.createVideo('/test/unit/assets/cat.webm', () => {
        // Workaround for headless tests, where the video data isn't loading
        // correctly: mock the video element using an image for this test
        const prevElt = testElement.elt;
        testElement.elt = imgElt.elt;

        myp5.background(255);
        myp5.tint(255, 0, 0);
        myp5.image(testElement, 0, 0);

        testElement.elt = prevElt;
        imgElt.remove();

        myp5.loadPixels();
        testElement.loadPixels();
        assert.equal(myp5.pixels[0], testElement.pixels[0]);
        assert.equal(myp5.pixels[1], 0);
        assert.equal(myp5.pixels[2], 0);
        done();
      });
    });

    test.todo('should work with updatePixels()', function(done) {
      let loaded = false;
      let prevElt;
      const imgElt = myp5.createImg('/test/unit/assets/cat.jpg', '');
      const testElement = myp5.createVideo('/test/unit/assets/cat.webm', () => {
        loaded = true;
        // Workaround for headless tests, where the video data isn't loading
        // correctly: mock the video element using an image for this test
        prevElt = testElement.elt;
        testElement.elt = imgElt.elt;
      });

      let drewUpdatedPixels = false;
      myp5.draw = function() {
        if (!loaded) return;
        myp5.background(255);

        if (!drewUpdatedPixels) {
          // First, update pixels and check that it draws the updated
          // pixels correctly
          testElement.loadPixels();
          for (let i = 0; i < testElement.pixels.length; i += 4) {
            // Set every pixel to red
            testElement.pixels[i] = 255;
            testElement.pixels[i + 1] = 0;
            testElement.pixels[i + 2] = 0;
            testElement.pixels[i + 3] = 255;
          }
          testElement.updatePixels();
          myp5.image(testElement, 0, 0);

          // The element should have drawn using the updated red pixels
          myp5.loadPixels();
          assert.deepEqual([...myp5.pixels.slice(0, 4)], [255, 0, 0, 255]);

          // Mark that we've done the first check so we can see whether
          // the video still updates on the next frame
          drewUpdatedPixels = true;
        } else {
          // Next, make sure it still updates with the real pixels from
          // the next frame of the video on the next frame of animation
          myp5.image(testElement, 0, 0);

          myp5.loadPixels();
          testElement.loadPixels();
          expect([...testElement.pixels.slice(0, 4)])
            .to.not.deep.equal([255, 0, 0, 255]);
          assert.deepEqual(
            [...myp5.pixels.slice(0, 4)],
            [...testElement.pixels.slice(0, 4)]
          );
          testElement.elt = prevElt;
          imgElt.remove();
          done();
        }
      };
    });
  });

  suite('p5.prototype.createAudio', function() {
    afterEach(function() {
      document.body.innerHTML = "";
    });

    const mediaSources = [
      '/test/unit/assets/beat.mp3',
      '/test/unit/assets/beat.mp3'
    ];

    test('should be a function', function() {
      assert.isFunction(mockP5Prototype.createAudio);
    });

    test('should return p5.Element of HTMLAudioElement', function() {
      const testElement = mockP5Prototype.createAudio('');
      assert.instanceOf(testElement, MediaElement);
      assert.instanceOf(testElement.elt, HTMLAudioElement);
    });

    test('should accept a singular media source', function() {
      const mediaSource = mediaSources[0];
      const testElement = mockP5Prototype.createAudio(mediaSource);
      const sourceEl = testElement.elt.children[0];

      assert.deepEqual(testElement.elt.childElementCount, 1);
      assert.instanceOf(sourceEl, HTMLSourceElement);
      assert.isTrue(sourceEl.src.endsWith(mediaSource));
    });

    test('should accept multiple media sources', function() {
      const testElement = mockP5Prototype.createAudio(mediaSources);

      assert.deepEqual(testElement.elt.childElementCount, mediaSources.length);
      for (let index = 0; index < mediaSources.length; index += 1) {
        const sourceEl = testElement.elt.children[index];
        assert.instanceOf(sourceEl, HTMLSourceElement);
        assert.isTrue(sourceEl.src.endsWith(mediaSources[index]));
      }
    });

    // testSketchWithPromise(
    //   'should trigger callback on canplaythrough event',
    //   function(sketch, resolve, reject) {
    //     sketch.setup = function() {
    //       testElement = mockP5Prototype.createAudio(mediaSources, resolve);
    //       testElement.elt.dispatchEvent(new Event('canplaythrough'));
    //     };
    //   }
    // );
  });

  suite('p5.prototype.createCapture', function() {
    afterEach(function() {
      document.body.innerHTML = "";
    });

    test('should be a function', function() {
      assert.isFunction(mockP5Prototype.createCapture);
    });

    test('should return p5.Element of video type', function() {
      const testElement = mockP5Prototype.createCapture(mockP5Prototype.VIDEO);
      assert.instanceOf(testElement, Element);
      assert.instanceOf(testElement.elt, HTMLVideoElement);
    });

    // NOTE: play() failed because the user didn't interact with the document first.
    // testSketchWithPromise(
    //   'triggers the callback after loading metadata',
    //   function(sketch, resolve, reject) {
    //     sketch.setup = function() {
    //       testElement = myp5.createCapture(myp5.VIDEO, resolve);
    //       const mockedEvent = new Event('loadedmetadata');
    //       testElement.elt.dispatchEvent(mockedEvent);
    //     };
    //   }
    // );

    // Required for ios 11 devices
    test('should have playsinline attribute to empty string on DOM element', function() {
      const testElement = mockP5Prototype.createCapture(mockP5Prototype.VIDEO);
      // Weird check, setter accepts : playinline, getter accepts playInline
      assert.isTrue(testElement.elt.playsInline);
    });
  });
});
