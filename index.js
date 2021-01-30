const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const notice = document.querySelector('.notice');
const score = document.querySelector('.score');
const best = document.querySelector('.best');

canvas.width = 400;
canvas.height = 600;

let rightPressed = false;
let leftPressed = false;

addEventListener('keydown', keyDownHandler, false);
addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function getDis(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function gameOver() {
  cancelAnimationFrame(timerId);

  document.body.style.backgroundColor = '#00a8ff';
  notice.style.color = 'white';

  addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      location.reload();
    }
  });

  localStorage.setItem(`${timerId}`, `${timerId}`);
}

function setBest() {
  let scoreArray = [];
  for (let i = 0; i < localStorage.length; i++) {
    scoreArray.push(localStorage.key(i));
  }

  let bestScore = Math.max.apply(null, scoreArray);

  if (localStorage.key(0) !== null) {
    best.innerHTML = `Best: ${bestScore}`;
  }
}

function levelUpdate(num) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.font = '50px "Anton"';
  ctx.fillText(`${num}`, canvas.width / 2, canvas.height / 2);
}

class Player {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;

    this.topX = this.x;
    this.topY = this.y - 40;

    this.sparkleX = this.x;
    this.sparkleY = this.topY;

    this.dir = 0;
  }
  draw() {
    //꼭다리
    ctx.beginPath();
    ctx.fillStyle = '#EE5A24';
    ctx.moveTo(this.x - this.radius, this.y);
    ctx.bezierCurveTo(
      this.x - this.radius,
      this.y - this.radius,
      this.x,
      this.y - this.radius,
      this.topX,
      this.topY
    );
    ctx.bezierCurveTo(
      this.x,
      this.y - this.radius,
      this.x + this.radius,
      this.y - this.radius,
      this.x + this.radius,
      this.y
    );
    ctx.fill();

    //몸
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      3,
      this.x,
      this.y,
      20
    );
    gradient.addColorStop(0, '#fff200');
    gradient.addColorStop(1, '#EE5A24');
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();

    // 반짝이;

    ctx.beginPath();
    ctx.fillStyle = '#EE5A24';
    ctx.arc(this.sparkleX, this.sparkleY, 1.5, 0, Math.PI * 2, false);
    ctx.fill();

    //눈

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(this.x - 8, this.y, 4, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(this.x + 8, this.y, 4, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(this.x - 8 + this.dir, this.y - 2, 2, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(this.x + 8 + this.dir, this.y - 2, 2, 0, Math.PI * 2, false);
    ctx.fill();
  }
  update() {
    if (rightPressed && this.x < canvas.width - this.radius) {
      this.x += 8;
      this.dir = 2;
    } else if (leftPressed && this.x > this.radius) {
      this.x -= 8;
      this.dir = -2;
    }

    this.prevTopX = this.topX;

    this.prevTopX = (this.x - this.prevTopX) * 0.25;

    this.topX += this.prevTopX;

    this.sparkleY -= 1;
    if (this.sparkleY < this.y - 50) {
      this.sparkleY = this.topY;
      this.sparkleX = this.topX;
    }

    this.draw();
  }
}

class Rain {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vy = 5;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = '#0984e3';
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';
    ctx.arc(this.x, this.y, this.radius - 5, 0, (Math.PI / 180) * 60, false);
    ctx.stroke();
  }
  update() {
    this.y += this.vy;
    if (this.y + this.radius > canvas.height) {
      this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
      this.y = 0 - this.radius;
    }

    if (
      getDis(this.x, this.y, player.x, player.y) <
      this.radius + player.radius
    ) {
      gameOver();
    }
    this.draw();
  }
}

class Ice {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;

    this.vx = 0;
    this.vy = 5;
    this.gravity = 0.5;

    this.isTouch = false;
  }
  draw() {
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      5,
      this.x,
      this.y,
      15
    );
    gradient.addColorStop(0, '#81ecec');
    gradient.addColorStop(1, '#00cec9');

    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (
      this.y + this.radius + this.vy > canvas.height &&
      this.isTouch === false
    ) {
      this.vy *= -0.5;
      this.vx = this.x > canvas.width / 2 ? -3 : 3;
      this.isTouch = true;
    } else if (this.y + this.radius > canvas.height && this.isTouch) {
      this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
      this.y = 0 - this.radius;
      this.vx = 0;
      this.vy = 5;
      this.isTouch = false;
    } else {
      this.vy += this.gravity;
    }

    if (
      getDis(this.x, this.y, player.x, player.y) <
      this.radius + player.radius
    ) {
      gameOver();
    }
    this.draw();
  }
}

let player;
const playerRadius = 20;

let totalRain = 10;
let rain;
let totalIce = 10;
let ice;

function init() {
  player = new Player(
    canvas.width / 2,
    canvas.height - playerRadius,
    playerRadius
  );

  rain = [];

  for (let i = 0; i < totalRain; i++) {
    const radius = 15;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height * 2) - canvas.height * 2;

    rain.push(new Rain(x, y, radius));
  }

  ice = [];

  for (let i = 0; i < totalIce; i++) {
    const radius = 15;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = 0;

    ice.push(new Ice(x, y, radius));
  }
}

let timerId;

function animate() {
  timerId = requestAnimationFrame(animate);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (timerId <= 300) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.font = '30px "Anton"';
    ctx.fillText(
      `Key Press '←' or '→'`,
      canvas.width / 2 - 110,
      canvas.height / 2
    );
  } else if (timerId <= 1000) {
    levelUpdate(1);
  } else if (timerId <= 2000) {
    levelUpdate(2);

    for (let i = 0; i < 1; i++) {
      ice[i].update();
    }
  } else {
    levelUpdate(3);

    for (let i = 0; i < 2; i++) {
      ice[i].update();
    }
  }

  score.innerHTML = `Score: ${timerId}`;

  player.update();

  for (let i = 0; i < 6; i++) {
    rain[i].update();
  }
}

init();
setBest();
animate();
