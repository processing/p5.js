let player;
let bullets = [];
let zombies = [];
let score = 0;
let gameRunning = true;
let zombieSpawnInterval = 60; // Frames between spawns
let lastSpawnFrame = 0;

// Sound effects (oscillators)
let shootOsc;
let hitOsc;
let gameOverOsc;

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('gameContainer');
  
  player = new Player();
  
  // Initialize sound oscillators
  shootOsc = new p5.Oscillator('square');
  hitOsc = new p5.Oscillator('sawtooth');
  gameOverOsc = new p5.Oscillator('sine');
}

function draw() {
  background(30);
  
  if (gameRunning) {
    // Player Logic
    player.update();
    player.display();
    
    // Bullet Logic
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].update();
      bullets[i].display();
      if (bullets[i].offscreen()) {
        bullets.splice(i, 1);
      }
    }
    
    // Zombie Logic
    if (frameCount - lastSpawnFrame > zombieSpawnInterval) {
      spawnZombie();
      lastSpawnFrame = frameCount;
      // Increase difficulty over time
      if (zombieSpawnInterval > 20) {
        zombieSpawnInterval -= 0.5;
      }
    }
    
    for (let i = zombies.length - 1; i >= 0; i--) {
      zombies[i].update(player.x, player.y);
      zombies[i].display();
      
      // Collision: Zombie hits Player
      if (player.hits(zombies[i])) {
        gameOver();
      }
      
      // Collision: Bullet hits Zombie
      for (let j = bullets.length - 1; j >= 0; j--) {
        if (bullets[j].hits(zombies[i])) {
          zombies.splice(i, 1);
          bullets.splice(j, 1);
          score += 10;
          updateScoreboard();
          playHitSound();
          break; // Break bullet loop since zombie is gone
        }
      }
    }
  } else {
    // Game Over Screen
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text("GAME OVER", width / 2, height / 2 - 20);
    textSize(20);
    text("Final Score: " + score, width / 2, height / 2 + 40);
    text("Press 'R' to Restart", width / 2, height / 2 + 80);
  }
}

function keyPressed() {
  if (key === ' ') {
    if (gameRunning) {
      player.shoot();
      playShootSound();
    }
  }
  
  if (!gameRunning && (key === 'r' || key === 'R')) {
    restartGame();
  }
}

function spawnZombie() {
  let side = floor(random(4));
  let x, y;
  
  if (side === 0) { // Top
    x = random(width);
    y = -50;
  } else if (side === 1) { // Bottom
    x = random(width);
    y = height + 50;
  } else if (side === 2) { // Left
    x = -50;
    y = random(height);
  } else { // Right
    x = width + 50;
    y = random(height);
  }
  
  zombies.push(new Zombie(x, y));
}

function updateScoreboard() {
  let scoreElement = select('#score');
  if (scoreElement) {
    scoreElement.html('Score: ' + score);
  }
}

function gameOver() {
  gameRunning = false;
  playGameOverSound();
}

function restartGame() {
  player = new Player();
  bullets = [];
  zombies = [];
  score = 0;
  updateScoreboard();
  gameRunning = true;
  zombieSpawnInterval = 60;
  lastSpawnFrame = frameCount;
}

// --- Classes ---

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.size = 30;
    this.speed = 5;
    this.color = color(0, 255, 255); // Cyan
  }
  
  update() {
    if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;
    if (keyIsDown(UP_ARROW)) this.y -= this.speed;
    if (keyIsDown(DOWN_ARROW)) this.y += this.speed;
    
    // Constrain to canvas
    this.x = constrain(this.x, this.size/2, width - this.size/2);
    this.y = constrain(this.y, this.size/2, height - this.size/2);
  }
  
  display() {
    fill(this.color);
    noStroke();
    rectMode(CENTER);
    rect(this.x, this.y, this.size, this.size);
  }
  
  shoot() {
    // Shoot in 4 directions
    bullets.push(new Bullet(this.x, this.y, 0, -1)); // Up
    bullets.push(new Bullet(this.x, this.y, 0, 1));  // Down
    bullets.push(new Bullet(this.x, this.y, -1, 0)); // Left
    bullets.push(new Bullet(this.x, this.y, 1, 0));  // Right
  }
  
  hits(zombie) {
    let d = dist(this.x, this.y, zombie.x, zombie.y);
    return d < (this.size / 2 + zombie.size / 2);
  }
}

class Bullet {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.speed = 10;
    this.size = 8;
    this.color = color(255, 255, 0); // Yellow
  }
  
  update() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }
  
  display() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
  
  offscreen() {
    return (this.x < 0 || this.x > width || this.y < 0 || this.y > height);
  }
  
  hits(zombie) {
    let d = dist(this.x, this.y, zombie.x, zombie.y);
    return d < (this.size / 2 + zombie.size / 2);
  }
}

class Zombie {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.speed = 1.5;
    this.color = color(0, 255, 0); // Green
  }
  
  update(targetX, targetY) {
    let angle = atan2(targetY - this.y, targetX - this.x);
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;
  }
  
  display() {
    fill(this.color);
    noStroke();
    rectMode(CENTER);
    rect(this.x, this.y, this.size, this.size);
  }
}

// --- Sound Functions ---

function playShootSound() {
  shootOsc.start();
  shootOsc.freq(880);
  shootOsc.amp(0.1);
  shootOsc.freq(440, 0.1);
  shootOsc.amp(0, 0.1);
  setTimeout(() => shootOsc.stop(), 100);
}

function playHitSound() {
  hitOsc.start();
  hitOsc.freq(200);
  hitOsc.amp(0.1);
  hitOsc.freq(100, 0.1);
  hitOsc.amp(0, 0.1);
  setTimeout(() => hitOsc.stop(), 100);
}

function playGameOverSound() {
  gameOverOsc.start();
  gameOverOsc.freq(300);
  gameOverOsc.amp(0.2);
  gameOverOsc.freq(50, 1.0);
  gameOverOsc.amp(0, 1.0);
  setTimeout(() => gameOverOsc.stop(), 1000);
}
