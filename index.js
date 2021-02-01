const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const notice = document.querySelector('.notice');
const score = document.querySelector('.score');
const best = document.querySelector('.best');

const stageWidth = document.body.clientWidth;
const stageHeight = document.body.clientHeight;

canvas.width = 400;
canvas.height = 600;

let rightPressed = false;
let leftPressed = false;

addEventListener('keydown', keyDownHandler, false);
addEventListener('keyup', keyUpHandler, false);

addEventListener('touchstart', touchDownHandler, false);
addEventListener('touchend', touchUpHandler, false);

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

function touchDownHandler(e) {
  if (e.clientX > stageWidth / 2) {
    rightPressed = true;
  } else if (e.clientX <= stageWidth / 2) {
    leftPressed = true;
  }
}

function touchUpHandler(e) {
  if (e.clientX > stageWidth / 2) {
    rightPressed = false;
  } else if (e.clientX <= stageWidth / 2) {
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
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
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
    this.topX = this.x;
    this.topY = this.y - 35;
    ctx.beginPath();
    ctx.fillStyle = '#0984e3';
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
    this.vy = 3;
    this.gravity = 0.5;

    this.side = this.radius * 2 + 4;

    this.isTouch = false;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.beginPath();
    const g = ctx.createRadialGradient(this.x, this.y, 3, this.x, this.y, 10);
    g.addColorStop(0, '#81ecec');
    g.addColorStop(1, '#00cec9');
    ctx.fillStyle = g;
    ctx.rect(
      this.x - this.side / 2,
      this.y - this.side / 2,
      this.side,
      this.side
    );
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

class Powder {
  constructor(x) {
    this.x = x;
    this.y = 0;
    this.w = 0;
    this.h = canvas.height;

    this.laserH = 0;

    this.isWarned = false;
    this.isFinished = false;
  }
  draw() {
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'transparent';
    ctx.moveTo(this.x + 15, this.y);
    ctx.lineTo(this.x + 15, this.laserH);
    ctx.stroke();

    ctx.beginPath();
    const g3 = ctx.createLinearGradient(
      this.x,
      this.y,
      this.x + this.w,
      this.y
    );
    g3.addColorStop(0, '#ecf0f1');
    g3.addColorStop(0.5, '#bdc3c7');
    g3.addColorStop(1, '#ecf0f1');
    ctx.fillStyle = g3;
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fill();
  }
  update() {
    if (this.isWarned === false) {
      if (this.laserH > canvas.height) {
        this.laserH = 0;
        this.isWarned = true;
        this.w = 30;
      } else {
        this.laserH += 10;
      }
    }
    if (this.isWarned === true) {
      if (this.w > 0) {
        this.x += 0.1;
        this.w = this.w.toFixed(1) - 0.2;
        console.log(this.w);
      } else {
        this.isFinished = true;
      }
    }
    if (this.isWarned === true && this.isFinished !== true)
      if (
        player.x + player.radius > this.x &&
        player.x - player.radius < this.x + this.w
      ) {
        gameOver();
      }
    this.draw();
  }
}

class FireExtinguisher {
  constructor(x) {
    this.w = 30;
    this.h = 100;

    this.nozzleW = 40;
    this.nozzleH = 50;

    this.gap = 5;

    this.x = x;
    this.y = 0 - this.h - this.nozzleH;

    this.powder = new Powder(this.x);

    this.isShot = false;
    this.isUp = false;
  }
  draw() {
    ctx.beginPath();
    const g2 = ctx.createLinearGradient(this.x, 0, this.x + this.w, 0);
    g2.addColorStop(0, '#1e272e');
    g2.addColorStop(0.5, '#485460');
    g2.addColorStop(1, '#1e272e');
    ctx.fillStyle = g2;
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fill();

    ctx.beginPath();
    const g = ctx.createLinearGradient(
      this.x - this.gap,
      this.y + this.h + this.nozzleH,
      this.x + this.w + this.gap,
      this.y + this.h + this.nozzleH
    );
    g.addColorStop(0, '#f1c40f');
    g.addColorStop(0.5, '#ffdd59');
    g.addColorStop(1, '#f1c40f');
    ctx.fillStyle = g;
    ctx.moveTo(this.x, this.y + this.h);
    ctx.lineTo(this.x + this.w, this.y + this.h);
    ctx.lineTo(this.x + this.w + this.gap, this.y + this.h + this.nozzleH);
    ctx.lineTo(this.x - this.gap, this.y + this.h + this.nozzleH);
    ctx.fill();

    ctx.beginPath();
    const g1 = ctx.createLinearGradient(this.x, 0, this.x + this.w, 0);
    g1.addColorStop(0, '#95a5a6');
    g1.addColorStop(0.5, '#ecf0f1');
    g1.addColorStop(1, '#95a5a6');
    ctx.fillStyle = g1;
    ctx.rect(this.x - 1, this.y + this.h - 7, this.w + 2, 7);
    ctx.fill();
  }
  update() {
    if (this.y < 0 && this.isShot === false) {
      this.y += 10;
    } else {
      this.powder.update();
      if (this.powder.isFinished === true) {
        this.isShot = true;
      }
    }
    if (this.isShot === true) {
      this.y -= 10;
      if (this.y === 0 - this.h - this.nozzleH) {
        this.isUp = true;
      }
    }
    if (this.isUp === false) {
      this.draw();
    }
    if (this.isUp === true) {
      this.x = Math.random() * (canvas.width - 20);
      this.y = 0 - this.h - this.nozzleH;

      this.powder = new Powder(this.x);

      this.isShot = false;
      this.isUp = false;
    }
  }
}

let player;
const playerRadius = 20;

let totalRain = 10;
let rain;
let totalIce = 10;
let ice;
let totalFireExtinguisher = 10;
let fireExtinguisher;

function init() {
  player = new Player(
    canvas.width / 2,
    canvas.height - playerRadius,
    playerRadius
  );

  rain = [];

  for (let i = 0; i < totalRain; i++) {
    const radius = 12;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height * 2) - canvas.height * 2;

    rain.push(new Rain(x, y, radius));
  }

  ice = [];

  for (let i = 0; i < totalIce; i++) {
    const radius = 10;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = 0;

    ice.push(new Ice(x, y, radius));
  }

  fireExtinguisher = [];

  for (let i = 0; i < totalFireExtinguisher; i++) {
    const x = Math.random() * (canvas.width - 20);

    fireExtinguisher.push(new FireExtinguisher(x));
  }
}

let timerId;
let num;

function animate() {
  timerId = requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (timerId <= 10) {
    ctx.save();
  } else if (timerId <= 200) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.font = '30px "Anton"';

    ctx.fillText(
      `Key Press '←' or '→'`,
      canvas.width / 2 - 110,
      canvas.height / 2
    );
  }

  if (timerId > 200) {
    for (let i = 0; i < 5; i++) {
      rain[i].update();
    }

    num = 1;
  }
  if (timerId > 1000) {
    num = 2;

    ice[0].update();
  }
  if (timerId > 2000) {
    num = 3;

    fireExtinguisher[0].update();
  }
  if (timerId > 3000) {
    num = 4;

    ice[1].update();
  }
  if (timerId > 4000) {
    num = 5;

    fireExtinguisher[1].update();
  }

  if (timerId > 200) {
    levelUpdate(num);
  }

  score.innerHTML = `Score: ${timerId}`;

  player.update();
}

init();
setBest();
animate();
