/* Grunt Task to test mocha in a local Chrome instance */

const puppeteer = require('puppeteer');
const EventHandler = require('eventhandler');
const util = require('util');
const mapSeries = require('promise-map-series');

module.exports = function(grunt) {
  grunt.registerMultiTask('mochaChrome', async function() {
    const done = this.async();

    try {
      const browser = await puppeteer.launch({
        headless: false
      });

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
                mocha.run = function(fn) {
                  return _mochaRun(function(stats) {
                    fireMochaEvent('mocha:ended', stats);
                    fn(stats);
                  });
                };
              }
            });
          `);

          await new Promise(async (resolve, reject) => {
            page.on('console', async msg => {
              const args = await mapSeries(msg.args(), v => v.jsonValue());
              console.log(util.format.apply(util, args));
            });

            eventHandler1.on('mocha:ended', resolve);

            await page.exposeFunction(
              'fireMochaEvent',
              eventHandler1.emit.bind(eventHandler1)
            );
            await page.goto(testURL);
          }).catch(reason => {
            throw reason;
          });
        } finally {
          await page.close({
            runBeforeUnload: false
          });
        }
      }

      await browser.close();

      done();
    } catch (e) {
      if (e instanceof Error) {
        done(e);
      } else {
        done(new Error(e));
      }
    }
  });
};
