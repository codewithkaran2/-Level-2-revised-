const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

const player1 = { x: 100, y: 300, width: 40, height: 40, color: "blue", health: 100, shield: 100, shieldActive: false };
const player2 = { x: 600, y: 300, width: 40, height: 40, color: "red", health: 100, shield: 100, shieldActive: false };

let bullets = [];
const speed = 5;
let gameRunning = true;

const keys = {
    w: false, a: false, s: false, d: false, // Player 1
    ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false, // Player 2
    q: false, m: false // Shield keys
};

// 🎮 Event Listeners
document.addEventListener("keydown", (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
    if (e.key === "q" && player1.shield > 0) player1.shieldActive = true;
    if (e.key === "m" && player2.shield > 0) player2.shieldActive = true;
    if (e.key === " " && gameRunning) shoot(player1); // Spacebar for Player 1
    if (e.key === "Enter" && gameRunning) shoot(player2); // Enter for Player 2
});

document.addEventListener("keyup", (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
    if (e.key === "q") player1.shieldActive = false;
    if (e.key === "m") player2.shieldActive = false;
});

// 🎯 Shooting Function
function shoot(player) {
    if (!gameRunning) return;
    bullets.push({
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        width: 10,
        height: 5,
        speed: player === player1 ? 7 : -7,
        color: player.color,
        shooter: player
    });
}

// 📌 Collision Detection
function checkBulletCollision(bullet, target) {
    return (
        bullet.x >= target.x && bullet.x <= target.x + target.width &&
        bullet.y >= target.y && bullet.y <= target.y + target.height
    );
}

// 🕹️ Game Loop
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🎭 Player Movement
    movePlayer(player1, keys.w, keys.a, keys.s, keys.d);
    movePlayer(player2, keys.ArrowUp, keys.ArrowLeft, keys.ArrowDown, keys.ArrowRight);

    // 🏹 Move Bullets & Check Collisions
    bullets = bullets.filter((bullet) => {
        bullet.x += bullet.speed;
        if (bullet.x < 0 || bullet.x > canvas.width) return false; // Remove out-of-bounds bullets

        let target = bullet.shooter === player1 ? player2 : player1;
        if (checkBulletCollision(bullet, target)) {
            if (target.shieldActive && target.shield > 0) {
                target.shield -= 20;
            } else {
                target.health -= 10;
            }
            updateHealthUI();
            return false; // Remove bullet on hit
        }
        return true; // Keep bullet if no collision
    });

    // 🎨 Draw Elements
    drawPlayer(player1);
    drawPlayer(player2);
    bullets.forEach(drawBullet);
    drawShields();

    // 🚨 Check Game Over
    if (player1.health <= 0 || player2.health <= 0) {
        document.getElementById("winner").innerText = player1.health <= 0 ? "Player 2 Wins!" : "Player 1 Wins!";
        gameRunning = false;
    } else {
        requestAnimationFrame(gameLoop);
    }
}

// 🎮 Move Player
function movePlayer(player, up, left, down, right) {
    if (left && player.x > 0) player.x -= speed;
    if (right && player.x + player.width < canvas.width) player.x += speed;
    if (up && player.y > 0) player.y -= speed;
    if (down && player.y + player.height < canvas.height) player.y += speed;
}

// 🏹 Draw Elements
function drawPlayer(player) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullet(bullet) {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}

function drawShields() {
    if (player1.shieldActive && player1.shield > 0) drawShield(player1, "cyan");
    if (player2.shieldActive && player2.shield > 0) drawShield(player2, "yellow");
}

function drawShield(player, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(player.x - 5, player.y - 5, player.width + 10, player.height + 10);
}

// ❤️ Update Health UI
function updateHealthUI() {
    document.getElementById("p1HealthBar").style.width = `${player1.health}%`;
    document.getElementById("p1HealthText").innerText = `${player1.health}%`;
    document.getElementById("p2HealthBar").style.width = `${player2.health}%`;
    document.getElementById("p2HealthText").innerText = `${player2.health}%`;
}

// 🔄 Restart Game
function restartGame() {
    player1.x = 100; player1.y = 300; player1.health = 100; player1.shield = 100; player1.shieldActive = false;
    player2.x = 600; player2.y = 300; player2.health = 100; player2.shield = 100; player2.shieldActive = false;
    bullets = [];
    gameRunning = true;
    document.getElementById("winner").innerText = "";
    updateHealthUI();
    requestAnimationFrame(gameLoop);
}

// 🚀 Start Game
gameLoop();
