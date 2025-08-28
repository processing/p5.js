// core
import p5 from './main';

// color
import color from '../color';
color(p5);

// accessibility
import accessibility from '../accessibility';
accessibility(p5);

// FES
import friendlyErrors from '../friendly_errors';
friendlyErrors(p5);

import { waitForDocumentReady, waitingForTranslator, _globalInit } from './init';
Promise.all([waitForDocumentReady(), waitingForTranslator]).then(_globalInit);

export default p5;

