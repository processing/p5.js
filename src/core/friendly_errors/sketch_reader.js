/**
 * @for p5
 * @requires core
 *
 */

import p5 from '../main';
import * as constants from '../constants';
import { translator } from '../internationalization';

const _checkForConsts = variables => {
  for (let i = 0; i < variables.length; i++) {
    if (constants[variables[i]] !== undefined) {
      let url = `https://p5js.org/reference/#/p5/${variables[i]}`;
      p5._friendlyError(
        translator('fes.sketchReaderErrors.reservedConst', {
          url: url,
          symbol: variables[i]
        })
      );
      break;
    }
  }
};

const _extractVariables = arr => {
  console.log(
    '%cFrom _extractVariables',
    'color: black; font-weight: bold; font-size: 16px; background: yellow;'
  );
  //extract variable names from the user's code
  let matches = [];
  arr.forEach(ele => {
    //extract a, b, c from let/const a=10, b=20, c;
    if (ele.includes(',')) {
      matches.push(
        ...ele.split(',').flatMap(s => {
          let match;
          if (s.includes('=')) {
            match = s.match(/(\w+)\s*(?==)/i);
            return match[1];
          } else if (!s.match(new RegExp('[[]{}]'))) {
            return s.match(/(?:(?:let|const|var)\s+)?([\w$]+)/)[1];
          } else return [];
        })
      );
    } else {
      //extract a from let/const a=10;
      const reg = /(?:(?:let|const)\s+)([\w$]+)/g;
      const found = ele.matchAll(reg);
      for (const match of found) {
        matches.push(match[1]);
      }
    }
  });
  //check if the obtained variables are a part of p5.js or not
  _checkForConsts(matches); //check if the obtained variables are a p5.js constants
};

const _extractFuncVariables = arr => {
  let matches = [];
  //extract function names
  console.log(
    '%cFrom _extractFuncVariables',
    'color: black; font-weight: bold; font-size: 16px; background: yellow;'
  );
  const reg = /(?:(?:let|const)\s+)([\w$]+)/;
  arr.forEach(ele => {
    matches.push(ele.match(reg)[1]);
  });
  //matches array contains the names of the functions
  console.log(matches);
};

const _codeToLines = code => {
  //convert code to array of code and filter out
  //unnecessary lines
  let arr = code.split('\n');
  //filter out lines containing variable names
  let arrVars = arr
    .map(line => line.trim())
    .filter(
      line =>
        line !== '' &&
        !line.includes('//') &&
        (line.includes('let') || line.includes('const')) &&
        (!line.includes('=>') && !line.includes('function'))
    );

  //filter out lines containing function names
  let arrFunc = arr
    .map(line => line.trim())
    .filter(
      line =>
        line !== '' &&
        !line.includes('//') &&
        (line.includes('let') || line.includes('const')) &&
        (line.includes('=>') || line.includes('function'))
    );

  //pass the relevant array to a function which will extract all the variables/functions names
  _extractVariables(arrVars);
  _extractFuncVariables(arrFunc);
};

const _removeMultilineComments = str => {
  let start = str.indexOf('/*');
  let end = str.indexOf('*/');

  //create a new string which don't have multiline comments
  while (start !== -1 && end !== -1) {
    if (start === 0) {
      str = str.substr(end + 2);
    } else str = str.substr(0, start) + str.substr(end + 2);

    start = str.indexOf('/*');
    end = str.indexOf('*/');
  }

  return str;
};

const _fesCodeReader = () => {
  return new Promise((resolve, reject) => {
    let codeNode = document.querySelector('[data-tag="@fs-sketch.js"]'),
      text = '';
    if (codeNode) {
      //if web editor
      text = codeNode.innerHTML;
      resolve(text);
    } else {
      //obtain the name of the file in script tag
      //ignore p5.js, p5.min.js, p5.sounds.js, p5.sounds.min.js
      const scripts = [...document.querySelectorAll('script')]
        .map(file => file.getAttribute('src'))
        .filter(
          attr =>
            attr !== null &&
            attr !== undefined &&
            !attr.includes('p5.js') &&
            !attr.includes('p5.min.js') &&
            !attr.includes('p5.sounds.min.js') &&
            !attr.includes('p5.sounds.js') &&
            attr !== ''
        );
      //obtain the user's code form the JS file
      fetch(`${scripts[0]}`).then(res =>
        res.text().then(txt => {
          text = txt;
          resolve(text);
        })
      );
    }
  });
};

window.addEventListener('load', () => {
  _fesCodeReader()
    .then(code => {
      //remove multiline comments
      code = _removeMultilineComments(code);
      //convert the code to array of lines of code
      _codeToLines(code);
    })
    .catch(err => console.log(err));
});

export default p5;
