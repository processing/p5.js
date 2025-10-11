# Test for Issue #8139: mouseX/mouseY not updated on canvas resize

## Bug Description
When the canvas position changes (e.g., opening/closing dev tools with F12, toggling fullscreen with F11, or resizing the browser window), the `mouseX` and `mouseY` values would freeze at their old values until the user physically moved the mouse.

## Expected Behavior
When the canvas position changes, `mouseX` and `mouseY` should automatically update to reflect the mouse's new position relative to the canvas, even if the mouse hasn't moved.

## Test Instructions

1. Open `index.html` in a web browser
2. Move your mouse onto the canvas and note the displayed `mouseX` and `mouseY` values
3. **Keep your mouse completely still**
4. Press F12 to open/close the browser developer tools
5. Observe that `mouseX` and `mouseY` values update automatically to reflect the new canvas position
6. Alternatively, press F11 to toggle fullscreen and observe the same behavior

## What to Look For

### Before the fix:
- `mouseX` and `mouseY` would stay frozen at old values
- The red circle indicator would appear in the wrong position
- Values would only update after the mouse was physically moved

### After the fix:
- `mouseX` and `mouseY` update immediately when canvas position changes
- The red circle indicator stays at the correct mouse position
- `winMouseX` and `winMouseY` remain constant (as they should)

## Technical Details

The fix adds a `resize` event listener that recalculates mouse coordinates relative to the canvas when the window is resized. It uses the stored `winMouseX` and `winMouseY` values (which represent the mouse position in window coordinates) and calls `getBoundingClientRect()` to get the updated canvas position.

### Modified Files:
- `src/events/mouse.js` - Added `_updateMouseCoordsFromWindowPosition()` method
- `src/core/main.js` - Added `resize` event listener that calls the new method
