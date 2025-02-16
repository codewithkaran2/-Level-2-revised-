const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// Player objects
const player1 = { x: 100, y: 300, width: 40, height: 40, color: "blue", health: 100, shield: 100, shieldActive: false };
const player2 = { x: 600, y: 300, width: 40, height: 40, color: "red", health: 100, shield: 100, shieldActive: false };

// Bullets
let bullets = [];

// Controls
const keys = {
    w: false, a: false, s: false, d: false, // Player 1
    ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false, // Player 2
    q: false, m: false // Shield keys
};

const speed = 5;
let gameRunning = true; // Ensure game stops when a player dies

// Event listeners for movement & shield
document.addEventListener("keydown", (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;

    // Activate shield
    if (e.key === "q" && player1.shield > 0) player1.shieldActive = true;
    if (e.key === "m" && player2.shield > 0) player2.shieldActive = true;
});

document.addEventListener("keyup", (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;

    // Deactivate shield
    if (e.key === "q") player1.shieldActive = false;
    if (e.key === "m") player2.shieldActive = false;
});

// Shooting function
function shoot(player) {
    if (!gameRunning) return; // Prevent shooting after game over

    let bulletSpeed = player === player1 ? 7 : -7;
    bullets.push({
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        width: 10,
        height: 5,
        speed: bulletSpeed,
        color: player.color,
        shooter: player
    });
}

// Game loop
function gameLoop() {
    if (!gameRunning) return; // Stop the game loop when a player wins

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player movement (with boundary restriction)
    if (keys.a && player1.x > 0) player1.x -= speed;
    if (keys.d && player1.x + player1.width < canvas.width) player1.x += speed;
    if (keys.w && player1.y > 0) player1.y -= speed;
    if (keys.s && player1.y + player1.height < canvas.height) player1.y += speed;

    if (keys.ArrowLeft && player2.x > 0) player2.x -= speed;
    if (keys.ArrowRight && player2.x + player2.width < canvas.width) player2.x += speed;
    if (keys.ArrowUp && player2.y > 0) player2.y -= speed;
    if (keys.ArrowDown && player2.y + player2.height < canvas.height) player2.y += speed;

    // Draw players
    ctx.fillStyle = player1.color;
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

    ctx.fillStyle = player2.color;
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

    // Move bullets
    bullets.forEach((bullet, index) => {
        bullet.x += bullet.speed;
        
        // Check collision with player 2
        if (
            bullet.shooter === player1 &&
            bullet.x >= player2.x && bullet.x <= player2.x + player2.width &&
            bullet.y >= player2.y && bullet.y <= player2.y + player2.height
        ) {
            if (player2.shieldActive && player2.shield > 0) {
                player2.shield -= 20; // Reduce shield instead of health
            } else {
                player2.health -= 10;
            }
            bullets.splice(index, 1);
        }

        // Check collision with player 1
        if (
            bullet.shooter === player2 &&
            bullet.x <= player1.x + player1.width && bullet.x >= player1.x &&
            bullet.y >= player1.y && bullet.y <= player1.y + player1.height
        ) {
            if (player1.shieldActive && player1.shield > 0) {
                player1.shield -= 20; // Reduce shield instead of health
            } else {
                player1.health -= 10;
            }
            bullets.splice(index, 1);
        }

        // Remove bullets out of bounds
        if (bullet.x < 0 || bullet.x > canvas.width) {
            bullets.splice(index, 1);
        }

        // Draw bullet
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw shield if active
    if (player1.shieldActive && player1.shield > 0) {
        ctx.strokeStyle = "cyan";
        ctx.lineWidth = 3;
        ctx.strokeRect(player1.x - 5, player1.y - 5, player1.width + 10, player1.height + 10);
    }
    if (player2.shieldActive && player2.shield > 0) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 3;
        ctx.strokeRect(player2.x - 5, player2.y - 5, player2.width + 10, player2.height + 10);
    }

    // Display health & shield
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`P1 Health: ${player1.health}% | Shield: ${player1.shield}%`, 10, 20);
    ctx.fillText(`P2 Health: ${player2.health}% | Shield: ${player2.shield}%`, canvas.width - 220, 20);

    // Check if player dies
    if (player1.health <= 0) {
        document.getElementById("winner").innerText = "Player 2 Wins!";
        gameRunning = false;
    }
    if (player2.health <= 0) {
        document.getElementById("winner").innerText = "Player 1 Wins!";
        gameRunning = false;
    }

    requestAnimationFrame(gameLoop);
}

// Shooting event
document.addEventListener("keydown", (e) => {
    if (e.key === " " && gameRunning) shoot(player1); // Player 1 shoots with Space
    if (e.key === "Enter" && gameRunning) shoot(player2); // Player 2 shoots with Enter
});

// Start game
gameLoop();
