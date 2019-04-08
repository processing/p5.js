/* Grunt Task to test mocha in a local Chrome instance */

const puppeteer = require('puppeteer');
const EventHandler = require('eventhandler');
const util = require('util');
const mapSeries = require('promise-map-series');

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
                    fireMochaEvent('mocha:end', runner.stats);
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

          await new Promise(async (resolve, reject) => {
            eventHandler1.on('mocha:end', stats => {
              if (stats.failures) reject(stats);
              else resolve(stats);
            });

            await page.goto(testURL);
          });
        } finally {
          await page.close({
            runBeforeUnload: false
          });
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
