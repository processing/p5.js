# Dark/Light Mode Toggle Feature

This feature adds a dark/light mode toggle to the p5.js test interfaces, addressing [Issue #8276](https://github.com/processing/p5.js/issues/8276).

## Features

- **One-click toggle**: Simple button to switch between dark and light themes
- **Persistent preferences**: User's theme choice is saved in localStorage
- **Works for all users**: Functions for both anonymous and logged-in users
- **Comprehensive theming**: Applies to background, sidebar, code panels, and all UI elements
- **Accessible**: Includes proper ARIA labels and keyboard navigation support
- **Smooth transitions**: CSS transitions for a polished user experience

## Files Added

- `test/dark-mode-toggle.js` - JavaScript module that handles theme switching logic
- `test/dark-mode.css` - CSS styles for both dark and light themes

## Files Modified

- `test/test.html` - Added dark mode toggle support
- `test/test-reference.html` - Added dark mode toggle support
- `test/test-minified.html` - Added dark mode toggle support

## Usage

The dark mode toggle is automatically initialized when the test pages load. Users can:

1. Click the theme toggle button (🌙/☀️) in the top-right corner
2. The theme preference is automatically saved
3. The preference persists across page reloads and browser sessions

## Implementation Details

### Theme Storage
- Uses `localStorage` with key `p5js-theme-preference`
- Defaults to 'light' mode if no preference is stored
- Gracefully handles cases where localStorage is unavailable

### Theme Application
- Applies `dark-mode` or `light-mode` classes to `<html>` and `<body>` elements
- Uses CSS custom properties (CSS variables) for easy theme customization
- All colors and styles are defined in `dark-mode.css`

### Button Placement
- Positioned in the top-right corner, near the mocha stats
- Fixed position for easy access
- Responsive and accessible

## Browser Support

Works in all modern browsers that support:
- localStorage
- CSS custom properties (CSS variables)
- classList API

## Testing

To test the feature:

1. Open any test HTML file (e.g., `test/test.html`) in a browser
2. Look for the theme toggle button in the top-right corner
3. Click to switch between dark and light modes
4. Reload the page to verify the preference persists

## Future Enhancements

Potential improvements for the web editor implementation:
- System preference detection (prefers-color-scheme media query)
- More granular theme controls
- Custom theme colors
- Theme synchronization across tabs

