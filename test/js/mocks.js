import { vi } from 'vitest';
import { http, HttpResponse, passthrough } from 'msw';
import { setupWorker } from 'msw/browser';

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
export const mockP5 = {
  _validateParameters: vi.fn()
};

export const mockP5Prototype = {};
