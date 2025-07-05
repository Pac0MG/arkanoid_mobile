const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Proporções para responsividade
const brick = {
  rowCount: 5,
  colCount: 6,
  width: canvas.width * 0.12,
  height: canvas.height * 0.035,
  padding: canvas.width * 0.015,
  offsetTop: canvas.height * 0.05,
  offsetLeft: 0, // será definido dinamicamente
};
brick.offsetLeft = (canvas.width - (brick.colCount * (brick.width + brick.padding) - brick.padding)) / 2;

const paddle = {
  width: canvas.width * 0.2,
  height: canvas.height * 0.02,
  x: canvas.width / 2 - canvas.width * 0.1,
  y: canvas.height - canvas.height * 0.05,
  speed: 0,
  color: "#0ff",
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height - canvas.height * 0.1,
  radius: canvas.width * 0.015,
  dx: canvas.width * 0.008,
  dy: -canvas.height * 0.008,
  color: "#f0f",
};

let bricks = [];
function initBricks() {
  bricks = [];
  for (let r = 0; r < brick.rowCount; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.colCount; c++) {
      bricks[r][c] = { x: 0, y: 0, status: 1 };
    }
  }
}
initBricks();

const brickSound = document.getElementById("brickSound");
let isGameRunning = false;

function drawPaddle() {
  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let r = 0; r < brick.rowCount; r++) {
    for (let c = 0; c < brick.colCount; c++) {
      if (bricks[r][c].status === 1) {
        const brickX = c * (brick.width + brick.padding) + brick.offsetLeft;
        const brickY = r * (brick.height + brick.padding) + brick.offsetTop;
        bricks[r][c].x = brickX;
        bricks[r][c].y = brickY;
        ctx.fillStyle = "#0f0";
        ctx.fillRect(brickX, brickY, brick.width, brick.height);
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
          ball.x > b.x &&
          ball.x < b.x + brick.width &&
          ball.y > b.y &&
          ball.y < b.y + brick.height
        ) {
          ball.dy = -ball.dy;
          b.status = 0;
          brickSound.currentTime = 0;
          brickSound.play();

          if (checkWin()) {
            showEndScreen("You win!");
          }
        }
      }
    }
  }
}

function checkWin() {
  for (let r = 0; r < brick.rowCount; r++) {
    for (let c = 0; c < brick.colCount; c++) {
      if (bricks[r][c].status === 1) return false;
    }
  }
  return true;
}

function draw() {
  if (!isGameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawPaddle();
  drawBall();
  collisionDetection();

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  if (
    ball.y + ball.radius > paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    ball.dy = -ball.dy;
  }

  if (ball.y + ball.radius > canvas.height) {
    showEndScreen("You lose!");
    return;
  }

  paddle.x += paddle.speed;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }

  requestAnimationFrame(draw);
}

canvas.addEventListener(
  "touchmove",
  function (e) {
    const touchX = e.touches[0].clientX;
    paddle.x = touchX - paddle.width / 2;
    e.preventDefault();
  },
  { passive: false }
);

function showEndScreen(message) {
  isGameRunning = false;
  document.getElementById("endMessage").textContent = message;
  document.getElementById("endScreen").classList.remove("hidden");
  canvas.style.display = "none";
}

function goToStart() {
  document.getElementById("endScreen").classList.add("hidden");
  document.getElementById("startScreen").style.display = "flex";

  paddle.x = canvas.width / 2 - paddle.width / 2;
  ball.x = canvas.width / 2;
  ball.y = canvas.height - canvas.height * 0.1;
  ball.dx = canvas.width * 0.008;
  ball.dy = -canvas.height * 0.008;
  initBricks();
  isGameRunning = false;
  canvas.style.display = "none";
}

function exitGame() {
  window.close();
  setTimeout(() => {
    window.location.href = "about:blank";
  }, 200);
}

document.getElementById("startButton").addEventListener("click", () => {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("endScreen").classList.add("hidden");
  canvas.style.display = "block";
  isGameRunning = true;
  draw();
});

document.getElementById("restartButton").addEventListener("click", goToStart);
document.getElementById("exitButton").addEventListener("click", exitGame);

