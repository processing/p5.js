/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 */

import color_conversion from '../color/color_conversion';

function colorNamer(p5, fn){
  //stores the original hsb values
  let originalHSB;

  //stores values for color name exceptions
  const colorExceptions = [
    {
      h: 0,
      s: 0,
      b: 0.8275,
      name: 'gray'
    },
    {
      h: 0,
      s: 0,
      b: 0.8627,
      name: 'gray'
    },
    {
      h: 0,
      s: 0,
      b: 0.7529,
      name: 'gray'
    },
    {
      h: 0.0167,
      s: 0.1176,
      b: 1,
      name: 'light pink'
    }
  ];

  //stores values for color names
  const colorLookUp = [
    {
      h: 0,
      s: 0,
      b: 0,
      name: 'black'
    },
    {
      h: 0,
      s: 0,
      b: 0.5,
      name: 'gray'
    },
    {
      h: 0,
      s: 0,
      b: 1,
      name: 'white'
    },
    {
      h: 0,
      s: 0.5,
      b: 0.5,
      name: 'dark maroon'
    },
    {
      h: 0,
      s: 0.5,
      b: 1,
      name: 'salmon pink'
    },
    {
      h: 0,
      s: 1,
      b: 0,
      name: 'black'
    },
    {
      h: 0,
      s: 1,
      b: 0.5,
      name: 'dark red'
    },
    {
      h: 0,
      s: 1,
      b: 1,
      name: 'red'
    },
    {
      h: 5,
      s: 0,
      b: 1,
      name: 'very light peach'
    },
    {
      h: 5,
      s: 0.5,
      b: 0.5,
      name: 'brown'
    },
    {
      h: 5,
      s: 0.5,
      b: 1,
      name: 'peach'
    },
    {
      h: 5,
      s: 1,
      b: 0.5,
      name: 'brick red'
    },
    {
      h: 5,
      s: 1,
      b: 1,
      name: 'crimson'
    },
    {
      h: 10,
      s: 0,
      b: 1,
      name: 'light peach'
    },
    {
      h: 10,
      s: 0.5,
      b: 0.5,
      name: 'brown'
    },
    {
      h: 10,
      s: 0.5,
      b: 1,
      name: 'light orange'
    },
    {
      h: 10,
      s: 1,
      b: 0.5,
      name: 'brown'
    },
    {
      h: 10,
      s: 1,
      b: 1,
      name: 'orange'
    },
    {
      h: 15,
      s: 0,
      b: 1,
      name: 'very light yellow'
    },
    {
      h: 15,
      s: 0.5,
      b: 0.5,
      name: 'olive green'
    },
    {
      h: 15,
      s: 0.5,
      b: 1,
      name: 'light yellow'
    },
    {
      h: 15,
      s: 1,
      b: 0,
      name: 'dark olive green'
    },
    {
      h: 15,
      s: 1,
      b: 0.5,
      name: 'olive green'
    },
    {
      h: 15,
      s: 1,
      b: 1,
      name: 'yellow'
    },
    {
      h: 20,
      s: 0,
      b: 1,
      name: 'very light yellow'
    },
    {
      h: 20,
      s: 0.5,
      b: 0.5,
      name: 'olive green'
    },
    {
      h: 20,
      s: 0.5,
      b: 1,
      name: 'light yellow green'
    },
    {
      h: 20,
      s: 1,
      b: 0,
      name: 'dark olive green'
    },
    {
      h: 20,
      s: 1,
      b: 0.5,
      name: 'dark yellow green'
    },
    {
      h: 20,
      s: 1,
      b: 1,
      name: 'yellow green'
    },
    {
      h: 25,
      s: 0.5,
      b: 0.5,
      name: 'dark yellow green'
    },
    {
      h: 25,
      s: 0.5,
      b: 1,
      name: 'light green'
    },
    {
      h: 25,
      s: 1,
      b: 0.5,
      name: 'dark green'
    },
    {
      h: 25,
      s: 1,
      b: 1,
      name: 'green'
    },
    {
      h: 30,
      s: 0.5,
      b: 1,
      name: 'light green'
    },
    {
      h: 30,
      s: 1,
      b: 0.5,
      name: 'dark green'
    },
    {
      h: 30,
      s: 1,
      b: 1,
      name: 'green'
    },
    {
      h: 35,
      s: 0,
      b: 0.5,
      name: 'light green'
    },
    {
      h: 35,
      s: 0,
      b: 1,
      name: 'very light green'
    },
    {
      h: 35,
      s: 0.5,
      b: 0.5,
      name: 'dark green'
    },
    {
      h: 35,
      s: 0.5,
      b: 1,
      name: 'light green'
    },
    {
      h: 35,
      s: 1,
      b: 0,
      name: 'very dark green'
    },
    {
      h: 35,
      s: 1,
      b: 0.5,
      name: 'dark green'
    },
    {
      h: 35,
      s: 1,
      b: 1,
      name: 'green'
    },
    {
      h: 40,
      s: 0,
      b: 1,
      name: 'very light green'
    },
    {
      h: 40,
      s: 0.5,
      b: 0.5,
      name: 'dark green'
    },
    {
      h: 40,
      s: 0.5,
      b: 1,
      name: 'light green'
    },
    {
      h: 40,
      s: 1,
      b: 0.5,
      name: 'dark green'
    },
    {
      h: 40,
      s: 1,
      b: 1,
      name: 'green'
    },
    {
      h: 45,
      s: 0.5,
      b: 1,
      name: 'light turquoise'
    },
    {
      h: 45,
      s: 1,
      b: 0.5,
      name: 'dark turquoise'
    },
    {
      h: 45,
      s: 1,
      b: 1,
      name: 'turquoise'
    },
    {
      h: 50,
      s: 0,
      b: 1,
      name: 'light sky blue'
    },
    {
      h: 50,
      s: 0.5,
      b: 0.5,
      name: 'dark cyan'
    },
    {
      h: 50,
      s: 0.5,
      b: 1,
      name: 'light cyan'
    },
    {
      h: 50,
      s: 1,
      b: 0.5,
      name: 'dark cyan'
    },
    {
      h: 50,
      s: 1,
      b: 1,
      name: 'cyan'
    },
    {
      h: 55,
      s: 0,
      b: 1,
      name: 'light sky blue'
    },
    {
      h: 55,
      s: 0.5,
      b: 1,
      name: 'light sky blue'
    },
    {
      h: 55,
      s: 1,
      b: 0.5,
      name: 'dark blue'
    },
    {
      h: 55,
      s: 1,
      b: 1,
      name: 'sky blue'
    },
    {
      h: 60,
      s: 0,
      b: 0.5,
      name: 'gray'
    },
    {
      h: 60,
      s: 0,
      b: 1,
      name: 'very light blue'
    },
    {
      h: 60,
      s: 0.5,
      b: 0.5,
      name: 'blue'
    },
    {
      h: 60,
      s: 0.5,
      b: 1,
      name: 'light blue'
    },
    {
      h: 60,
      s: 1,
      b: 0.5,
      name: 'navy blue'
    },
    {
      h: 60,
      s: 1,
      b: 1,
      name: 'blue'
    },
    {
      h: 65,
      s: 0,
      b: 1,
      name: 'lavender'
    },
    {
      h: 65,
      s: 0.5,
      b: 0.5,
      name: 'navy blue'
    },
    {
      h: 65,
      s: 0.5,
      b: 1,
      name: 'light purple'
    },
    {
      h: 65,
      s: 1,
      b: 0.5,
      name: 'dark navy blue'
    },
    {
      h: 65,
      s: 1,
      b: 1,
      name: 'blue'
    },
    {
      h: 70,
      s: 0,
      b: 1,
      name: 'lavender'
    },
    {
      h: 70,
      s: 0.5,
      b: 0.5,
      name: 'navy blue'
    },
    {
      h: 70,
      s: 0.5,
      b: 1,
      name: 'lavender blue'
    },
    {
      h: 70,
      s: 1,
      b: 0.5,
      name: 'dark navy blue'
    },
    {
      h: 70,
      s: 1,
      b: 1,
      name: 'blue'
    },
    {
      h: 75,
      s: 0.5,
      b: 1,
      name: 'lavender'
    },
    {
      h: 75,
      s: 1,
      b: 0.5,
      name: 'dark purple'
    },
    {
      h: 75,
      s: 1,
      b: 1,
      name: 'purple'
    },
    {
      h: 80,
      s: 0.5,
      b: 1,
      name: 'pinkish purple'
    },
    {
      h: 80,
      s: 1,
      b: 0.5,
      name: 'dark purple'
    },
    {
      h: 80,
      s: 1,
      b: 1,
      name: 'purple'
    },
    {
      h: 85,
      s: 0,
      b: 1,
      name: 'light pink'
    },
    {
      h: 85,
      s: 0.5,
      b: 0.5,
      name: 'purple'
    },
    {
      h: 85,
      s: 0.5,
      b: 1,
      name: 'light fuchsia'
    },
    {
      h: 85,
      s: 1,
      b: 0.5,
      name: 'dark fuchsia'
    },
    {
      h: 85,
      s: 1,
      b: 1,
      name: 'fuchsia'
    },
    {
      h: 90,
      s: 0.5,
      b: 0.5,
      name: 'dark fuchsia'
    },
    {
      h: 90,
      s: 0.5,
      b: 1,
      name: 'hot pink'
    },
    {
      h: 90,
      s: 1,
      b: 0.5,
      name: 'dark fuchsia'
    },
    {
      h: 90,
      s: 1,
      b: 1,
      name: 'fuchsia'
    },
    {
      h: 95,
      s: 0,
      b: 1,
      name: 'pink'
    },
    {
      h: 95,
      s: 0.5,
      b: 1,
      name: 'light pink'
    },
    {
      h: 95,
      s: 1,
      b: 0.5,
      name: 'dark magenta'
    },
    {
      h: 95,
      s: 1,
      b: 1,
      name: 'magenta'
    }
  ];

  //returns text with color name
  function _calculateColor(hsb) {
    let colortext;
    //round hue
    if (hsb[0] !== 0) {
      hsb[0] = Math.round(hsb[0] * 100);
      let hue = hsb[0].toString().split('');
      const last = hue.length - 1;
      hue[last] = parseInt(hue[last]);
      //if last digit of hue is < 2.5 make it 0
      if (hue[last] < 2.5) {
        hue[last] = 0;
        //if last digit of hue is >= 2.5 and less than 7.5 make it 5
      } else if (hue[last] >= 2.5 && hue[last] < 7.5) {
        hue[last] = 5;
      }
      //if hue only has two digits
      if (hue.length === 2) {
        hue[0] = parseInt(hue[0]);
        //if last is greater than 7.5
        if (hue[last] >= 7.5) {
          //add one to the tens
          hue[last] = 0;
          hue[0] = hue[0] + 1;
        }
        hsb[0] = hue[0] * 10 + hue[1];
      } else {
        if (hue[last] >= 7.5) {
          hsb[0] = 10;
        } else {
          hsb[0] = hue[last];
        }
      }
    }
    //map brightness from 0 to 1
    hsb[2] = hsb[2] / 255;
    //round saturation and brightness
    for (let i = hsb.length - 1; i >= 1; i--) {
      if (hsb[i] <= 0.25) {
        hsb[i] = 0;
      } else if (hsb[i] > 0.25 && hsb[i] < 0.75) {
        hsb[i] = 0.5;
      } else {
        hsb[i] = 1;
      }
    }
    //after rounding, if the values are hue 0, saturation 0 and brightness 1
    //look at color exceptions which includes several tones from white to gray
    if (hsb[0] === 0 && hsb[1] === 0 && hsb[2] === 1) {
      //round original hsb values
      for (let i = 2; i >= 0; i--) {
        originalHSB[i] = Math.round(originalHSB[i] * 10000) / 10000;
      }
      //compare with the values in the colorExceptions array
      for (let e = 0; e < colorExceptions.length; e++) {
        if (
          colorExceptions[e].h === originalHSB[0] &&
          colorExceptions[e].s === originalHSB[1] &&
          colorExceptions[e].b === originalHSB[2]
        ) {
          colortext = colorExceptions[e].name;
          break;
        } else {
          //if there is no match return white
          colortext = 'white';
        }
      }
    } else {
      //otherwise, compare with values in colorLookUp
      for (let i = 0; i < colorLookUp.length; i++) {
        if (
          colorLookUp[i].h === hsb[0] &&
          colorLookUp[i].s === hsb[1] &&
          colorLookUp[i].b === hsb[2]
        ) {
          colortext = colorLookUp[i].name;
          break;
        }
      }
    }
    return colortext;
  }

  //gets rgba and returs a color name
  fn._rgbColorName = function(arg) {
    //conversts rgba to hsb
    let hsb = color_conversion._rgbaToHSBA(arg);
    //stores hsb in global variable
    originalHSB = hsb;
    //calculate color name
    return _calculateColor([hsb[0], hsb[1], hsb[2]]);
  };
}

export default colorNamer;

if(typeof p5 !== 'undefined'){
  colorNamer(p5, p5.prototype);
}
