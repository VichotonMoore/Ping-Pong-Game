const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Sonidos 8-bit
const sounds = {
  bounce: new Audio("https://freesound.org/data/previews/342/342756_5121236-lq.mp3"),
  score: new Audio("https://freesound.org/data/previews/341/341695_6266196-lq.mp3"),
  start: new Audio("https://freesound.org/data/previews/518/518182_10545041-lq.mp3"),
};

const paddleWidth = 10, paddleHeight = 100;
const ballSize = 10;
let wKey = false, sKey = false;

const player = { x: 10, y: canvas.height / 2 - paddleHeight / 2, score: 0 };
const ai = { x: canvas.width - paddleWidth - 10, y: canvas.height / 2 - paddleHeight / 2, score: 0 };
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 4 * (Math.random() > 0.5 ? 1 : -1),
  vy: 2 * (Math.random() > 0.5 ? 1 : -1),
  speed: 4
};

function drawRect(x, y, w, h, color = "#0f0") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color = "#0f0") {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y, size = "20px", color = "#0f0") {
  ctx.fillStyle = color;
  ctx.font = `${size} 'Press Start 2P', cursive`;
  ctx.fillText(text, x, y);
}

function drawNet() {
  for (let i = 0; i < canvas.height; i += 20) {
    drawRect(canvas.width / 2 - 1, i, 2, 10, "#0f0");
  }
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
  ball.vy = ball.speed * (Math.random() > 0.5 ? 1 : -1);
  ball.speed = 4;
  sounds.start.play();
}

function update() {
  // Jugador
  if (wKey && player.y > 0) player.y -= 5;
  if (sKey && player.y < canvas.height - paddleHeight) player.y += 5;

  // IA
  let aiCenter = ai.y + paddleHeight / 2;
  if (aiCenter < ball.y - 10) ai.y += 4;
  else if (aiCenter > ball.y + 10) ai.y -= 4;

  // Pelota
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Rebote en paredes
  if (ball.y < 0 || ball.y > canvas.height - ballSize) {
    ball.vy *= -1;
  }

  // Colisión con jugador
  if (
    ball.x < player.x + paddleWidth &&
    ball.y > player.y &&
    ball.y < player.y + paddleHeight
  ) {
    ball.vx *= -1;
    ball.speed += 0.3;
    ball.vx = ball.vx > 0 ? ball.speed : -ball.speed;
    sounds.bounce.play();
  }

  // Colisión con IA
  if (
    ball.x > ai.x - ballSize &&
    ball.y > ai.y &&
    ball.y < ai.y + paddleHeight
  ) {
    ball.vx *= -1;
    ball.speed += 0.3;
    ball.vx = ball.vx > 0 ? ball.speed : -ball.speed;
    sounds.bounce.play();
  }

  // Puntos
  if (ball.x < 0) {
    ai.score++;
    resetBall();
    sounds.score.play();
  }

  if (ball.x > canvas.width) {
    player.score++;
    resetBall();
    sounds.score.play();
  }
}

function render() {
  drawRect(0, 0, canvas.width, canvas.height, "#000"); // fondo
  drawNet();
  drawRect(player.x, player.y, paddleWidth, paddleHeight); // jugador
  drawRect(ai.x, ai.y, paddleWidth, paddleHeight); // IA
  drawCircle(ball.x, ball.y, ballSize); // pelota
  drawText(player.score, canvas.width / 4 - 20, 50);
  drawText(ai.score, (3 * canvas.width) / 4 - 20, 50);
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "w" || e.key === "W") wKey = true;
  if (e.key === "s" || e.key === "S") sKey = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "w" || e.key === "W") wKey = false;
  if (e.key === "s" || e.key === "S") sKey = false;
});

resetBall();
gameLoop();
