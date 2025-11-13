# JavaScript-Game
# Survive the Horde 🧟‍♂️

A simple JavaScript + p5.js survival shooter game where you must defend yourself from endless waves of enemies approaching from all directions. Use your reflexes to shoot and survive as long as possible!

---

## 🎮 How to Play

- Use **Arrow Keys** to move the player.
- Press **Spacebar** to shoot bullets in all four directions.
- Each enemy (zombie) destroyed increases your **score**.
- The game ends when an enemy touches you.
- Your final score will be displayed when the game is over.

---

## 🧠 Game Logic Overview

- The player (blue square) stays within the play area.
- Enemies (green squares) continuously spawn and move toward the player.
- Bullets (yellow dots) move outward when you press the Spacebar.
- The game tracks:
  - Active enemies
  - Bullets fired
  - Collision detection (bullet–enemy and enemy–player)
  - Score updates and game-over logic

---

## 🧩 Technologies Used

- **HTML5** — structure of the game page  
- **CSS3** — simple dark theme and game layout  
- **JavaScript (ES6)** — game logic, movement, and collisions  
- **[p5.js](https://p5js.org/)** — for rendering and animation loop

---

## 🚀 How to Run Locally

### Option 1 — Run with VS Code (Recommended)
1. Open this folder in VS Code  
2. Right-click `index.html`  
3. Choose **“Open with Live Server”**  
4. Play at `http://127.0.0.1:5500/examples/javascript_game/`

### Option 2 — Run with Node.js
```bash
cd examples/javascript_game
npx serve

