import { parse } from '../../../src/io/csv';

suite('csv parse', function () {
  test('keeps the last row of a one-column file without a trailing newline', function () {
    expect(parse('a\nb')).toEqual([['a'], ['b']]);
  });

  test('parses a single value as one row', function () {
    expect(parse('only')).toEqual([['only']]);
    expect(parse('42')).toEqual([['42']]);
  });

  test('parses a single quoted value as one row', function () {
    expect(parse('"only"')).toEqual([['only']]);
  });

  test('keeps a row after an empty line', function () {
    expect(parse('a\n\nb')).toEqual([['a'], [''], ['b']]);
  });

  test('does not add a row for a trailing newline', function () {
    expect(parse('a\n')).toEqual([['a']]);
    expect(parse('x,y\n1,2\n')).toEqual([['x', 'y'], ['1', '2']]);
  });

  test('keeps multi-column rows and trailing empty fields', function () {
    expect(parse('x,y\n1,2')).toEqual([['x', 'y'], ['1', '2']]);
    expect(parse('x,')).toEqual([['x', '']]);
  });

  test('returns no rows for an empty string', function () {
    expect(parse('')).toEqual([]);
  });
});
