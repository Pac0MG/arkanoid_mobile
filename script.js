const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const paddle = {
  width: 100,
  height: 20,
  x: canvas.width / 2 - 50,
  y: canvas.height - 40,
  speed: 0,
  color: "#0ff",
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  radius: 10,
  dx: 4,
  dy: -4,
  color: "#f0f",
};

const brick = {
  rowCount: 5,
  colCount: 6,
  width: 60,
  height: 20,
  padding: 10,
  offsetTop: 50,
  offsetLeft: 30
};

let bricks = [];

function initBricks() {
  bricks = [];
  for(let r = 0; r < brick.rowCount; r++) {
    bricks[r] = [];
    for(let c = 0; c < brick.colCount; c++) {
      bricks[r][c] = { x: 0, y: 0, status: 1 };
    }
  }
}
initBricks();

const brickSound = document.getElementById("brickSound");

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
  for(let r = 0; r < brick.rowCount; r++) {
    for(let c = 0; c < brick.colCount; c++) {
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
  for(let r = 0; r < brick.rowCount; r++) {
    for(let c = 0; c < brick.colCount; c++) {
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
        }
      }
    }
  }
}

function draw() {
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

  let bricksLeft = 0;
  for (let r = 0; r < brick.rowCount; r++) {
    for (let c = 0; c < brick.colCount; c++) {
      if (bricks[r][c].status === 1) {
        bricksLeft++;
      }
    }
  }
  if (bricksLeft === 0) {
    showEndScreen("You win!");
    return;
  }

  paddle.x += paddle.speed;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

  requestAnimationFrame(draw);
}

canvas.addEventListener("touchmove", function(e) {
  const touchX = e.touches[0].clientX;
  paddle.x = touchX - paddle.width / 2;
  e.preventDefault();
}, { passive: false });

function showEndScreen(message) {
  document.getElementById("endMessage").textContent = message;
  document.getElementById("endScreen").style.display = "flex";
  canvas.style.display = "none";
}

function goToStart() {
  document.getElementById("endScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";

  paddle.x = canvas.width / 2 - paddle.width / 2;
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 60;
  ball.dx = 4;
  ball.dy = -4;
  initBricks();
}

function exitGame() {
  window.close(); // Tenta fechar aba se possível
  setTimeout(() => {
    window.location.href = "about:blank"; // Fallback
  }, 200);
}

document.getElementById("startButton").addEventListener("click", function () {
  document.getElementById("startScreen").style.display = "none";
  canvas.style.display = "block";
  draw();
});
