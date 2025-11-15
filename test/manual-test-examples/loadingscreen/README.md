# Loading Screen Test Examples

This directory contains test examples for the p5.js loading indicator feature.

## Test Files

### 1. `test-visual-spinner.html`
Tests the new default visual loading spinner with a simple JSON load.

**What to expect:**
- Pink animated spinner (p5.js brand color #ED225D)
- Centered on the page
- Smooth rotation animation
- Disappears when loading completes

### 2. `test-visual-spinner-slow.html`
Tests the visual loading spinner with multiple file loads to make it visible for longer.

**What to expect:**
- Same pink animated spinner
- Visible for longer due to multiple asset loads
- Success message after loading completes
- Shows count of loaded assets

### 3. `index.html` (Custom Loading Screen)
Tests the ability to override the default loading screen with custom content.

**How to test:**
- Uncomment one of the `<div id="p5_loading">` elements in the HTML
- The custom div will be displayed instead of the default spinner
- Custom styles can be applied via CSS

### 4. `preload_success_callbacks.html`
Tests loading with success callbacks to ensure the loading indicator works with callback-based loading.

## Default Loading Indicator

As of p5.js 2.x, the default loading indicator is a visual animated spinner instead of text-based "Loading...".

**Features:**
- ✅ Language-independent (no text)
- ✅ Accessible and visually clear
- ✅ Uses p5.js brand colors
- ✅ Non-intrusive design
- ✅ Works before canvas initialization

## Customizing the Loading Screen

### Method 1: CSS Override
You can style the default loading screen using CSS:

```html
<style>
  #p5_loading {
    background-color: rgba(0, 0, 0, 0.8) !important;
  }
  
  .p5-loading-spinner {
    width: 60px !important;
    height: 60px !important;
    border-width: 6px !important;
  }
</style>
```

### Method 2: Custom HTML Element
Create your own loading screen by adding a div with id `p5_loading` before loading p5.js:

```html
<div id="p5_loading">
  <h1>Please wait...</h1>
  <p>Loading your awesome sketch!</p>
</div>
```

### Method 3: Remove Loading Indicator
To hide the loading indicator entirely:

```html
<style>
  #p5_loading {
    display: none !important;
  }
</style>
```

## Testing Checklist

When testing the loading indicator, verify:

- [ ] Spinner appears when preload() is defined and assets are loading
- [ ] Spinner is centered on the page
- [ ] Animation is smooth (no jank)
- [ ] Spinner disappears after all assets load
- [ ] Custom loading screens still work (backward compatibility)
- [ ] No console errors
- [ ] Works in both global and instance mode
- [ ] Accessible (visible, not too bright/distracting)

## Browser Compatibility

The visual loading spinner uses CSS animations, which are supported in all modern browsers:
- Chrome/Edge 43+
- Firefox 16+
- Safari 9+

For older browsers, the spinner will still display (just not animated).

## Related Issue

This implementation addresses issue [#6795](https://github.com/processing/p5.js/issues/6795) - "Visual loading indicator fallback while assets are loading".
