const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

const data = fs.readFileSync('.all-contributorsrc', 'utf-8');
const parsed = JSON.parse(data);
const contributors = parsed.contributors;

const AVATAR_SIZE = 50;
const GAP = 4;
const COLS = 40;
const ROWS = Math.ceil(contributors.length / COLS);

const width = COLS * AVATAR_SIZE + (COLS - 1) * GAP;
const height = ROWS * AVATAR_SIZE + (ROWS - 1) * GAP;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

async function loadAvatar(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    return await loadImage(buffer);
  } catch (err) {
    return null;
  }
}

(async () => {
  for (let i = 0; i < contributors.length; i++) {
    const c = contributors[i];

    const col = i % COLS;
    const row = Math.floor(i / COLS);

    const x = col * (AVATAR_SIZE + GAP);
    const y = row * (AVATAR_SIZE + GAP);

    const img = await loadAvatar(c.avatar_url);

    ctx.save();
    ctx.beginPath();
    ctx.arc(
      x + AVATAR_SIZE / 2,
      y + AVATAR_SIZE / 2,
      AVATAR_SIZE / 2,
      0,
      Math.PI * 2
    );
    ctx.clip();

    if (img) {
      ctx.drawImage(img, x, y, AVATAR_SIZE, AVATAR_SIZE);
    }
    ctx.restore();
  }

  fs.writeFileSync('contributors.png', canvas.toBuffer('image/png'));
})();
