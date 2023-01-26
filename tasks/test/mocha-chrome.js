/* Grunt Task to test mocha in a local Chrome instance */

const puppeteer = require('puppeteer');
const util = require('util');
const mapSeries = require('promise-map-series');
const fs = require('fs');
const EventEmitter = require('events');

const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

module.exports = function(grunt) {
  grunt.registerMultiTask('mochaChrome', async function() {
    const done = this.async();

    // Launch Chrome in headless mode
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      // options here come from `Gruntfile.js` > `mochaConfig.test`
      const options = this.data.options;

      for (const testURL of options.urls) {
        const event = new EventEmitter();
        const page = await browser.newPage();

        try {
          // Using eval to start the test in the browser
          // A 'mocha:end' event will be triggered with test runner end
          await page.evaluateOnNewDocument(`
            addEventListener('DOMContentLoaded', () => {
              if (typeof mocha !== 'undefined') {
                const _mochaRun = mocha.run.bind(mocha);
                mocha.reporter('spec');
                mocha.color(true);
                mocha.run = function(fn) {
                  debugger;
                  var runner = _mochaRun(function(stats) {
                    if (typeof fn === 'function')
                      return fn(stats);
                  });

                  runner.on('end', () => {
                    const results = { stats: runner.stats, coverage: window.__coverage__ }
                    fireMochaEvent('mocha:end', results);
                  });

                  return runner;
                };
              }
            });
          `);

          // Pipe console messages from the browser to the terminal
          page.on('console', async msg => {
            const args = await mapSeries(msg.args(), v => v.jsonValue());
            console.log(util.format.apply(util, args));
          });

          // Wait for test end function to be called and emit on the event
          await page.exposeFunction('fireMochaEvent', event.emit.bind(event));

          await new Promise(async (resolve, reject) => {
            // When test end, check if there are any failures and record coverage
            event.on('mocha:end', async results => {
              const { stats, coverage } = results;
              if (stats.failures) {
                reject(stats);
              }
              await saveCoverage(coverage);
              resolve(stats);
            });

            // Nagivate to URL and start test
            await page.goto(testURL);
          });
        } finally {
          await page.close();
        }
      }

      done();
    } catch (e) {
      if (e instanceof Error) {
        done(e);
      } else {
        done(new Error(e));
      }
    } finally {
      await browser.close();
    }
  });
};

async function saveCoverage(cov) {
  if (cov) {
    try {
      await mkdir('./.nyc_output/', { recursive: true });
      await writeFile('./.nyc_output/out.json', JSON.stringify(cov));
    } catch (e) {
      console.error(e);
    }
  }
}
