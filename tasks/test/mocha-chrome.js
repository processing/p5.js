/* Grunt Task to test mocha in a local Chrome instance */

const puppeteer = require('puppeteer');
const EventHandler = require('eventhandler');
const util = require('util');
const mapSeries = require('promise-map-series');
const fs = require('fs');

const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

module.exports = function(grunt) {
  grunt.registerMultiTask('mochaChrome', async function() {
    const done = this.async();

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });

    try {
      const options = this.data.options;
      for (const testURL of options.urls) {
        const eventHandler1 = new EventHandler();
        const page = await browser.newPage();

        try {
          await page.evaluateOnNewDocument(`
            addEventListener('DOMContentLoaded', () => {
              if (typeof mocha !== 'undefined') {
                const _mochaRun = mocha.run.bind(mocha);
                mocha.reporter('spec');
                mocha.useColors(true);
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

          page.on('console', async msg => {
            const args = await mapSeries(msg.args(), v => v.jsonValue());
            console.log(util.format.apply(util, args));
          });

          await page.exposeFunction(
            'fireMochaEvent',
            eventHandler1.emit.bind(eventHandler1)
          );

          await new Promise(async resolve => {
            eventHandler1.on('mocha:end', async results => {
              const { stats, coverage } = results;
              if (stats.failures) {
                throw new Error(stats);
              }
              await saveCoverage(coverage);
              resolve(stats);
            });

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
