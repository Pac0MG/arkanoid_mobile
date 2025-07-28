const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const gameInfo = document.getElementById("gameInfo");

// Game background - using canvas gradients instead of external images
function drawBackground() {
  // Create animated starfield background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0a0a2e');
  gradient.addColorStop(0.5, '#16213e');
  gradient.addColorStop(1, '#0f3460');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add some animated stars
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  const time = Date.now() * 0.001;
  for (let i = 0; i < 50; i++) {
    const x = (i * 123.456) % canvas.width;
    const y = (i * 789.012 + time * 20) % canvas.height;
    const size = Math.sin(time + i) * 0.5 + 1;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

let gameState = {
  score: 0,
  level: 1,
  isRunning: false
};

// Responsive canvas setup
function resizeCanvas() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  canvas.width = width;
  canvas.height = height;
  
  // Set canvas style dimensions as well
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  
  // Reposition game elements
  if (paddle.x > 0) {
    paddle.x = Math.min(paddle.x, canvas.width - paddle.width);
  }
  paddle.y = canvas.height - 40;
  
  if (ball.x > canvas.width) ball.x = canvas.width / 2;
  if (ball.y > canvas.height) ball.y = canvas.height - 60;
}

const paddle = {
  width: Math.min(120, window.innerWidth * 0.25),
  height: 20,
  x: 0,
  y: 0,
  speed: 0,
  color: "#00ffff",
};

const ball = {
  x: 0,
  y: 0,
  radius: 8,
  dx: 5,
  dy: -5,
  color: "#ff00ff",
  maxSpeed: 12
};

const brick = {
  rowCount: 5,
  colCount: Math.floor(window.innerWidth / 80),
  width: 60,
  height: 20,
  padding: 8,
  offsetTop: 80,
  offsetLeft: 20,
};

const brickColors = ["#ff4444", "#ff8844", "#ffff44", "#44ff44", "#4488ff"];
let bricks = [];

function initBricks() {
  bricks = [];
  brick.colCount = Math.floor((window.innerWidth - 40) / (brick.width + brick.padding));
  
  for (let r = 0; r < brick.rowCount; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.colCount; c++) {
      bricks[r][c] = { 
        x: 0, 
        y: 0, 
        status: 1, 
        color: brickColors[r % brickColors.length] 
      };
    }
  }
}

const brickSound = document.getElementById("brickSound");

function drawPaddle() {
  // Gradient paddle
  const gradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
  gradient.addColorStop(0, paddle.color);
  gradient.addColorStop(1, "#0088cc");
  
  ctx.fillStyle = gradient;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  
  // Paddle border
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  // Reset any previous shadow effects
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  
  // Ball with glow effect
  ctx.shadowColor = ball.color;
  ctx.shadowBlur = 15;
  
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
  
  // Reset shadow for other elements
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  
  // Inner highlight
  ctx.beginPath();
  ctx.arc(ball.x - 2, ball.y - 2, ball.radius * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  const totalBricksWidth = brick.colCount * brick.width + (brick.colCount - 1) * brick.padding;
  const offsetLeft = (canvas.width - totalBricksWidth) / 2;
  
  for (let r = 0; r < brick.rowCount; r++) {
    for (let c = 0; c < brick.colCount; c++) {
      if (bricks[r][c].status === 1) {
        const brickX = c * (brick.width + brick.padding) + offsetLeft;
        const brickY = r * (brick.height + brick.padding) + brick.offsetTop;
        bricks[r][c].x = brickX;
        bricks[r][c].y = brickY;
        
        // Brick gradient
        const gradient = ctx.createLinearGradient(brickX, brickY, brickX, brickY + brick.height);
        gradient.addColorStop(0, bricks[r][c].color);
        gradient.addColorStop(1, "#000000");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(brickX, brickY, brick.width, brick.height);
        
        // Brick border
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.strokeRect(brickX, brickY, brick.width, brick.height);
      }
    }
  }
}

function collisionDetection() {
  for (let r = 0; r < brick.rowCount; r++) {
    for (let c = 0; c < brick.colCount; c++) {
      const b = bricks[r][c];
      if (b.status === 1) {
        if (
          ball.x + ball.radius > b.x &&
          ball.x - ball.radius < b.x + brick.width &&
          ball.y + ball.radius > b.y &&
          ball.y - ball.radius < b.y + brick.height
        ) {
          // Determine collision side for better physics
          const ballCenterX = ball.x;
          const ballCenterY = ball.y;
          const brickCenterX = b.x + brick.width / 2;
          const brickCenterY = b.y + brick.height / 2;
          
          const diffX = ballCenterX - brickCenterX;
          const diffY = ballCenterY - brickCenterY;
          
          if (Math.abs(diffX) > Math.abs(diffY)) {
            ball.dx = -ball.dx;
          } else {
            ball.dy = -ball.dy;
          }
          
          b.status = 0;
          gameState.score += 10 * gameState.level;
          scoreElement.textContent = gameState.score;
          
          // Play sound
          brickSound.volume = 0.3;
          brickSound.currentTime = 0;
          brickSound.play().catch(e => console.log("Sound error:", e));

          if (checkWin()) {
            nextLevel();
            return;
          }
        }
      }
    }
  }
}

function checkWin() {
  for (let r = 0; r < brick.rowCount; r++) {
    for (let c = 0; c < brick.colCount; c++) {
      if (bricks[r][c].status === 1) {
        return false;
      }
    }
  }
  return true;
}

function nextLevel() {
  gameState.level++;
  levelElement.textContent = gameState.level;
  
  // Increase ball speed slightly
  const speedIncrease = 1.2;
  ball.dx *= speedIncrease;
  ball.dy *= speedIncrease;
  
  // Cap maximum speed
  if (Math.abs(ball.dx) > ball.maxSpeed) {
    ball.dx = ball.dx > 0 ? ball.maxSpeed : -ball.maxSpeed;
  }
  if (Math.abs(ball.dy) > ball.maxSpeed) {
    ball.dy = ball.dy > 0 ? ball.maxSpeed : -ball.maxSpeed;
  }
  
  // Reset ball position
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 60;
  
  // Create new bricks
  initBricks();
  
  if (gameState.level > 5) {
    showEndScreen("Congratulations! You completed all levels!");
  }
}

function draw() {
  if (!gameState.isRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  drawBackground();

  drawBricks();
  drawPaddle();
  drawBall();
  collisionDetection();

  // Ball movement
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball collision with walls
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  // Ball collision with paddle - improved
  if (
    ball.y + ball.radius >= paddle.y &&
    ball.y - ball.radius <= paddle.y + paddle.height &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width &&
    ball.dy > 0
  ) {
    // Add angle based on where ball hits paddle
    const hitPos = (ball.x - paddle.x) / paddle.width;
    const angle = (hitPos - 0.5) * Math.PI / 3; // Max 60 degrees
    
    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    ball.dx = Math.sin(angle) * speed;
    ball.dy = -Math.abs(Math.cos(angle) * speed);
  }

  // Game over condition
  if (ball.y + ball.radius > canvas.height) {
    showEndScreen("Game Over! Score: " + gameState.score);
    return;
  }

  // Paddle movement
  paddle.x += paddle.speed;

  // Paddle bounds
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }

  requestAnimationFrame(draw);
}

// Touch and mouse controls
function handleMove(clientX) {
  if (gameState.isRunning) {
    paddle.x = clientX - paddle.width / 2;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) {
      paddle.x = canvas.width - paddle.width;
    }
  }
}

canvas.addEventListener("touchmove", function (e) {
  handleMove(e.touches[0].clientX);
  e.preventDefault();
}, { passive: false });

canvas.addEventListener("mousemove", function (e) {
  handleMove(e.clientX);
});

// End Screen functions
function showEndScreen(message) {
  gameState.isRunning = false;
  document.getElementById("endMessage").textContent = message;
  document.getElementById("endScreen").classList.remove("hidden");
  gameInfo.classList.add("hidden");
  canvas.style.display = "none";
}

function goToStart() {
  document.getElementById("endScreen").classList.add("hidden");
  document.getElementById("startScreen").style.display = "flex";
  gameInfo.classList.add("hidden");

  // Reset game state
  gameState.score = 0;
  gameState.level = 1;
  scoreElement.textContent = gameState.score;
  levelElement.textContent = gameState.level;

  // Reset positions
  resizeCanvas();
  paddle.x = canvas.width / 2 - paddle.width / 2;
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 60;
  ball.dx = 5;
  ball.dy = -5;

  initBricks();
  gameState.isRunning = false;
  canvas.style.display = "none";
}

function exitGame() {
  if (window.close) {
    window.close();
  }
  setTimeout(() => {
    window.location.href = "about:blank";
  }, 200);
}

// Window resize handler
window.addEventListener('resize', () => {
  if (gameState.isRunning) {
    resizeCanvas();
  }
});

// Initialize game
document.addEventListener("DOMContentLoaded", function () {
  // Ensure canvas context is available
  if (!ctx) {
    console.error("Canvas context not available");
    return;
  }
  
  resizeCanvas();
  initBricks();
  
  document.getElementById("startButton").addEventListener("click", () => {
    resizeCanvas();
    
    paddle.x = canvas.width / 2 - paddle.width / 2;
    paddle.y = canvas.height - 40;
    
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 60;
    ball.dx = 5;
    ball.dy = -5;

    document.getElementById("startScreen").style.display = "none";
    document.getElementById("endScreen").classList.add("hidden");
    gameInfo.classList.remove("hidden");

    canvas.style.display = "block";

    gameState.isRunning = true;
    
    // Force first draw
    setTimeout(() => {
      draw();
    }, 100);
  });

  document.getElementById("restartButton").addEventListener("click", goToStart);
  document.getElementById("exitButton").addEventListener("click", exitGame);
});
