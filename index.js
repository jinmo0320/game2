const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const notice = document.querySelector('.notice');
const score = document.querySelector('.score');
const best = document.querySelector('.best');
const startBtn = document.querySelector('.start');

const bgm = new Audio('./bgm.mp3');
bgm.volume = 0.5;
bgm.currentTime = 1.5;
bgm.loop = true;
bgm.play();

canvas.width = 400;
canvas.height = 600;

let rightPressed = false;
let leftPressed = false;

addEventListener('keydown', keyDownHandler, false);
addEventListener('keyup', keyUpHandler, false);

addEventListener('touchstart', touchDown, false);
addEventListener('touchend', touchUp, false);

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39 || e.clientX > canvas.width / 2) {
    rightPressed = false;
  } else if (e.keyCode == 37 || e.clientX <= canvas.width / 2) {
    leftPressed = false;
  }
}

function touchDown(e) {
  if (e.touches[0].clientX > canvas.width / 2) {
    rightPressed = true;
  } else {
    leftPressed = true;
  }
}

function touchUp(e) {
  rightPressed = false;
  leftPressed = false;
}

function getDis(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function checkMobileDevice() {
  var mobileKeyWords = new Array(
    'Android',
    'iPhone',
    'iPad',
    'BlackBerry',
    'Windows CE',
    'SAMSUNG',
    'LG',
    'MOT',
    'SonyEricsson'
  );
  for (var info in mobileKeyWords) {
    if (navigator.userAgent.match(mobileKeyWords[info]) != null) {
      return true;
    }
  }
  return false;
}

function gameOver() {
  cancelAnimationFrame(timerId);

  document.body.style.backgroundColor = '#261911';

  startBtn.style.display = 'block';

  startBtn.addEventListener('click', () => {
    location.reload();
  });

  addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      location.reload();
    }
  });
  bgm.pause();
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

    this.sizeupY = 0;

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
      this.radius
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
    if (this.sparkleY < this.y - 50 - this.sizeupY) {
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
    this.topY = this.y - 30;
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
    this.vy = 0;
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
    g3.addColorStop(0, '#b2bec3');
    g3.addColorStop(0.5, '#dfe6e9');
    g3.addColorStop(1, '#b2bec3');
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
      this.y += 5;
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

class Flammable {
  constructor(radius) {
    this.radius = radius;
    this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
    this.y = 0;

    this.vy = 7;
    this.vRadius = 50;

    this.isGet = false;

    this.img = new Image();
    this.img.src = './flammable.jpg';
  }
  draw() {
    ctx.beginPath();
    ctx.beginPath();
    ctx.drawImage(this.img, this.x - 17, this.y - 17, 34, 34);

    const g = ctx.createRadialGradient(
      this.x,
      this.y,
      10,
      this.x,
      this.y,
      this.radius
    );
    g.addColorStop(0, 'transparent');
    g.addColorStop(1, '#e74c3c');
    ctx.fillStyle = g;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
  }
  update() {
    this.y += this.vy;

    if (
      getDis(this.x, this.y, player.x, player.y) <
      this.radius + player.radius
    ) {
      if (this.radius < 800) {
        this.vy = 0;
        this.radius += this.vRadius;
        this.isGet = true;
      } else {
        this.isGet = false;
      }
    }
    if (this.isGet) {
      for (let i = 0; i < totalRain; i++) {
        if (
          getDis(rain[i].x, rain[i].y, this.x, this.y) <
          rain[i].radius + this.radius
        ) {
          rain[i].x =
            Math.random() * (canvas.width - rain[i].radius * 2) +
            rain[i].radius;
          rain[i].y = Math.random() * (canvas.height * 2) - canvas.height * 2;
        }
      }
    }
    if (this.isGet) {
      for (let i = 0; i < totalIce; i++) {
        if (
          getDis(ice[i].x, ice[i].y, this.x, this.y) <
          ice[i].radius + this.radius
        ) {
          ice[i].x =
            Math.random() * (canvas.width - ice[i].radius * 2) + ice[i].radius;
          ice[i].y = 0 - ice[i].radius;
          ice[i].vy = 0;
          ice[i].vx = 0;
          ice[i].isTouch = false;
        }
      }
    }
    if (this.radius < 800) {
      this.draw();
    }
  }
}

let player;
const playerRadius = 20;

const totalRain = 20;
let rain;
const totalIce = 10;
let ice;
const totalFireExtinguisher = 10;
let fireExtinguisher;
const totalFlammable = 10;
let flammable;

function init() {
  player = new Player(
    canvas.width / 2,
    canvas.height - playerRadius,
    playerRadius
  );

  rain = [];

  for (let i = 0; i < totalRain; i++) {
    const radius = 8;
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

  flammable = [];

  for (let i = 0; i < totalFlammable; i++) {
    flammable.push(new Flammable(25));
  }
}

let timerId;
let num;
let timing = Math.random() * 500 + 10;
let timing2 = Math.random() * 500 + 10;

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
  if (timerId < 2000) {
    if (timerId > 200) {
      for (let i = 0; i < 5; i++) {
        rain[i].update();
      }

      if (timerId > 300 + timing) {
        flammable[0].update();
      }

      num = 1;
    }
    if (timerId > 1000) {
      num = 2;
      ice[0].update();

      if (timerId > 1000 + timing) {
        flammable[1].update();
      }
    }
  }
  //소화기
  if (timerId > 2000 && timerId < 3000) {
    num = 3;

    for (let i = 0; i < 3; i++) {
      fireExtinguisher[i].update();
    }
  }

  if (timerId < 5000) {
    if (timerId > 3000) {
      num = 4;

      for (let i = 1; i < 3; i++) {
        ice[i].update();
      }
      if (timerId > 3000 + timing) {
        flammable[2].update();
      }
    }
    if (timerId > 4000) {
      num = 5;
      for (let i = 5; i < 9; i++) {
        rain[i].update();
      }
      if (timerId > 4000 + timing) {
        flammable[3].update();
      }
    }
  }
  //소화기
  if (timerId > 5000 && timerId < 6000) {
    num = 6;

    for (let i = 3; i < 9; i++) {
      fireExtinguisher[i].update();
    }
  }

  if (timerId < 8000) {
    if (timerId > 6000) {
      num = 7;
      for (let i = 3; i < 6; i++) {
        ice[i].update();
      }
      if (timerId > 6000 + timing) {
        flammable[4].update();
      }
    }
    if (timerId > 7000) {
      num = 8;
      for (let i = 9; i < 13; i++) {
        rain[i].update();
      }
      if (timerId > 7000 + timing) {
        flammable[5].update();
      }
    }
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
