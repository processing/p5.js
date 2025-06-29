import { vi } from 'vitest';
import { http, HttpResponse, passthrough } from 'msw';
import { setupWorker } from 'msw/browser';
import { States } from '../../src/core/States';

// HTTP requests mocks
const httpMocks = [
  http.get('404file', () => {
    return new HttpResponse('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }),
  http.all('*', ({request}) => {
    return passthrough();
  })
];

export const httpMock = setupWorker(...httpMocks);

// p5.js module mocks
const rendererStates = new States({});
export const mockP5 = vi.fn();
Object.assign(mockP5, {
  _validateParameters: vi.fn(),
  _friendlyFileLoadError: vi.fn(),
  _friendlyError: vi.fn(),
  Renderer: {
    states: rendererStates
  }
});

const mockCanvas = document.createElement('canvas');
mockCanvas.id = 'myCanvasID';
document.getElementsByTagName("body")[0].appendChild(mockCanvas);

export const mockP5Prototype = {
  saveCanvas: vi.fn(),
  elt: mockCanvas,
  _curElement: {
    elt: mockCanvas
  },
  canvas: {
    id: 'myCanvasID'
  },
  _elements: [],
  _renderer: {
    states: rendererStates
  }
};
