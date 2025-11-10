const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

class Player {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.size = 30;
        this.color = "cyan";
        this.speed = 5;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    move(dirX, dirY) {
        if (this.x + dirX >= 0 && this.x + this.size + dirX <= canvas.width) {
            this.x += dirX;
        }
        if (this.y + dirY >= 0 && this.y + this.size + dirY <= canvas.height) {
            this.y += dirY;
        }
    }
}

class Bullet {
    constructor(x, y, dirX, dirY) {
        this.x = x;
        this.y = y;
        this.size = 8;
        this.color = "yellow";
        this.speed = 15; // ✅ Increased bullet speed
        this.dirX = dirX;
        this.dirY = dirY;
    }

    update() {
        this.x += this.dirX * this.speed;
        this.y += this.dirY * this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

class Zombie {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 35;
        this.color = "green";
        this.speed = 1.5;
    }

    update(targetX, targetY) {
        let dx = targetX - this.x;
        let dy = targetY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

let player = new Player();
let bullets = [];
let zombies = [];
let score = 0;
let keys = {};
let gameRunning = true;
let zombieSpawnInterval;

function spawnZombie() {
    let side = Math.floor(Math.random() * 4);
    let x, y;

    if (side === 0) {
        x = Math.random() * canvas.width;
        y = 0;
    } else if (side === 1) {
        x = Math.random() * canvas.width;
        y = canvas.height;
    } else if (side === 2) {
        x = 0;
        y = Math.random() * canvas.height;
    } else {
        x = canvas.width;
        y = Math.random() * canvas.height;
    }

    zombies.push(new Zombie(x, y));
}

function startZombieSpawn() {
    clearInterval(zombieSpawnInterval);
    zombieSpawnInterval = setInterval(spawnZombie, 1000);
}

function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keys["ArrowLeft"]) player.move(-player.speed, 0);
    if (keys["ArrowRight"]) player.move(player.speed, 0);
    if (keys["ArrowUp"]) player.move(0, -player.speed);
    if (keys["ArrowDown"]) player.move(0, player.speed);

    player.draw();

    bullets.forEach((bullet, bulletIndex) => {
        bullet.update();
        bullet.draw();

        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(bulletIndex, 1);
        }
    });

    zombies.forEach((zombie, zombieIndex) => {
        zombie.update(player.x, player.y);
        zombie.draw();

        if (
            player.x < zombie.x + zombie.size &&
            player.x + player.size > zombie.x &&
            player.y < zombie.y + zombie.size &&
            player.y + player.size > zombie.y
        ) {
            gameOver();
        }

        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < zombie.x + zombie.size &&
                bullet.x + bullet.size > zombie.x &&
                bullet.y < zombie.y + zombie.size &&
                bullet.y + bullet.size > zombie.y
            ) {
                zombies.splice(zombieIndex, 1);
                bullets.splice(bulletIndex, 1);
                score += 10;
                updateScoreboard();
            }
        });
    });

    requestAnimationFrame(update);
}

function gameOver() {
    gameRunning = false;
    clearInterval(zombieSpawnInterval);
    setTimeout(() => {
        alert("Game Over! Your Final Score: " + score);
        restartGame();
    }, 100);
}

function restartGame() {
    player = new Player();
    bullets = [];
    zombies = [];
    score = 0;
    updateScoreboard();
    keys = {};
    gameRunning = true;
    startZombieSpawn();
    update();
}

function updateScoreboard() {
    document.getElementById("score").innerText = "Score: " + score;
}

// Remove old event listeners before adding new ones
document.removeEventListener("keydown", handleKeyDown);
document.removeEventListener("keyup", handleKeyUp);

function handleKeyDown(e) {
    keys[e.key] = true;

    if (e.key === " ") {
        fireBullets(); // ✅ Fires multiple bullets
    }
}

function handleKeyUp(e) {
    keys[e.key] = false;
}

// ✅ Shoots 3 bullets in different directions
function fireBullets() {
    let directions = [
        { dx: 1, dy: 0 },  // Right
        { dx: 0, dy: -1 }, // Up
        { dx: -1, dy: 0 }, // Left
        { dx: 0, dy: 1 }   // Down
    ];

    directions.forEach(dir => {
        bullets.push(new Bullet(player.x + player.size / 2, player.y + player.size / 2, dir.dx, dir.dy));
    });
}


document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

startZombieSpawn();
update();
