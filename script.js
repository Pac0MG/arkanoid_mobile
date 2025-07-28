const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const gameInfo = document.getElementById("gameInfo");

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0a0a2e');
  gradient.addColorStop(0.5, '#16213e');
  gradient.addColorStop(1, '#0f3460');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
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

function resizeCanvas() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  canvas.width = width;
  canvas.height = height;
  
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

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
const paddleSound = document.getElementById("paddleSound");

let audioContext = null;
let audioInitialized = false;

function initAudio() {
  if (audioInitialized) return;
  
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    audioInitialized = true;
    console.log("Audio initialized successfully");
  } catch (e) {
    console.log("Audio initialization failed:", e);
  }
}

function playSound(audioElement, volume = 0.3) {
  if (!audioElement) return;
  
  try {
    audioElement.volume = volume;
    audioElement.currentTime = 0;
    
    const playPromise = audioElement.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
        })
        .catch(error => {
          console.log("Audio play failed:", error);
          audioElement.play().catch(() => {
            createBeepSound(volume);
          });
        });
    }
  } catch (e) {
    console.log("Sound play error:", e);
    createBeepSound(volume);
  }
}

function createBeepSound(volume = 0.3) {
  if (!audioContext) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (e) {
    console.log("Beep sound creation failed:", e);
  }
}

function drawPaddle() {
  const gradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
  gradient.addColorStop(0, paddle.color);
  gradient.addColorStop(1, "#0088cc");
  
  ctx.fillStyle = gradient;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  
  ctx.shadowColor = ball.color;
  ctx.shadowBlur = 15;
  
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  
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
        
        const gradient = ctx.createLinearGradient(brickX, brickY, brickX, brickY + brick.height);
        gradient.addColorStop(0, bricks[r][c].color);
        gradient.addColorStop(1, "#000000");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(brickX, brickY, brick.width, brick.height);
        
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
    
          playSound(brickSound, 0.4);

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
  
  const speedIncrease = 1.2;
  ball.dx *= speedIncrease;
  ball.dy *= speedIncrease;
  
  if (Math.abs(ball.dx) > ball.maxSpeed) {
    ball.dx = ball.dx > 0 ? ball.maxSpeed : -ball.maxSpeed;
  }
  if (Math.abs(ball.dy) > ball.maxSpeed) {
    ball.dy = ball.dy > 0 ? ball.maxSpeed : -ball.maxSpeed;
  }
  
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 60;
  
  initBricks();
  
  if (gameState.level > 5) {
    showEndScreen("Congratulations! You completed all levels!");
  }
}

function draw() {
  if (!gameState.isRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();

  drawBricks();
  drawPaddle();
  drawBall();
  collisionDetection();

  // Ball movement
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  if (
    ball.y + ball.radius >= paddle.y &&
    ball.y - ball.radius <= paddle.y + paddle.height &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width &&
    ball.dy > 0
  ) {
    const hitPos = (ball.x - paddle.x) / paddle.width;
    const angle = (hitPos - 0.5) * Math.PI / 3; // Max 60 degrees
    
    const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    ball.dx = Math.sin(angle) * speed;
    ball.dy = -Math.abs(Math.cos(angle) * speed);
    
    playSound(paddleSound, 0.2);
  }

  if (ball.y + ball.radius > canvas.height) {
    showEndScreen("Game Over! Score: " + gameState.score);
    return;
  }

  paddle.x += paddle.speed;

  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }

  requestAnimationFrame(draw);
}

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

canvas.addEventListener("touchstart", initAudio, { once: true });
canvas.addEventListener("click", initAudio, { once: true });

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

  gameState.score = 0;
  gameState.level = 1;
  scoreElement.textContent = gameState.score;
  levelElement.textContent = gameState.level;

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

window.addEventListener('resize', () => {
  if (gameState.isRunning) {
    resizeCanvas();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  
  if (!ctx) {
    console.error("Canvas context not available");
    return;
  }
  
  resizeCanvas();
  initBricks();
  
  document.getElementById("startButton").addEventListener("click", () => {
    initAudio();
    
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
    
    setTimeout(() => {
      draw();
    }, 100);
  });

  document.getElementById("restartButton").addEventListener("click", goToStart);
  document.getElementById("exitButton").addEventListener("click", exitGame);
});
