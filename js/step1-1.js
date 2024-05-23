let pressTime = 0;
let duration = 0;
let displayTime = 0;
let showTime = false;
let ball;
let dragging = false;
let timerRunning = true;
let showBall = true;
let img, img4, Img6, Img7, Img8, Img9, Img10, Img11;
let circles = [];
let mousePressedFlag = false;
let lastCircleTime = 0;
let circleInterval = 10;
let effectShown = false;

function preload() {
  img = loadImage('./img/img-step1/img1.png');
  img4 = loadImage('./img/img-step1/img4.png');
 // Img5 = loadImage('Img5.png');
  Img6 = loadImage('./img/img-step1/Img6.png');
  Img7 = loadImage('./img/img-step1/Img7.png');
  Img8 = loadImage('./img/img-step1/Img8.png');
  Img9 = loadImage('./img/img-step1/Img9.png');
  Img10 = loadImage('./img/img-step1/Img10.png');
  Img11 = loadImage('./img/img-step1/Img11.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ball = createVector(width / 2 + 10, height * 0.8);
  effectShown = false;
}

function draw() {
  let currentTime = millis();

  if (showTime) {
    background(230); // 当显示时间时，改变背景颜色
    textSize(800);
    textAlign(CENTER, CENTER);
    fill(255, 129, 100);
    text(displayTime, width / 2, height / 2);
  } else {
    background(230); // 其他时候使用普通的白色背景
  }

  if (mousePressedFlag) {
    duration = currentTime - pressTime;
    displayTime = Math.min(7, Math.floor(duration / 1000));

    if (currentTime - lastCircleTime > circleInterval && random() < 0.3) {
      let imgArray = [Img6, Img7, Img8, Img9, Img10, Img11];
      let randomImg = random(imgArray);
      let newSizeX = random(0.3, 0.5); // 随机宽度缩放
      let newSizeY = random(0.2, 0.5); // 随机高度缩放
      let newAngle = random(TWO_PI);

      let newCircle = {
        x: random(width),
        y: random(height),
        img: randomImg,
        sizeX: newSizeX,
        sizeY: newSizeY,
        angle: newAngle
      };
      circles.push(newCircle);
      lastCircleTime = currentTime;
    }
  }

  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];
    push();
    translate(circle.x, circle.y);
    rotate(circle.angle);
    scale(circle.sizeX, circle.sizeY); // 应用随机宽高缩放
    imageMode(CENTER);
    image(circle.img, 0, 0);
    pop();
  }

  push();
  imageMode(CENTER);
  image(img, windowWidth / 2, windowHeight / 2 - 300, 800, 450);
  pop();

  if (showBall) {
    imageMode(CENTER);
    image(img4, ball.x, ball.y, 360, 240);
  }
}


function mousePressed() {
  if (effectShown) return;
  mousePressedFlag = true;
  pressTime = millis();
  let d = dist(mouseX, mouseY, ball.x, ball.y);
  if (d < 180) {
    dragging = true;
  } else {
    let newCircle = {
      x: mouseX,
      y: mouseY,
      size: random(10, 100),
      color: color(random(255), random(255), random(255))
    };
    circles.push(newCircle);
  }
}

function mouseReleased() {
  if (effectShown) return;
  mousePressedFlag = false;
  showTime = true;
  dragging = false;
  timerRunning = false;
  showBall = false;
  circles = [];
  effectShown = true;
}

function mouseDragged() {
  if (dragging) {
    ball.x = mouseX;
    ball.y = mouseY;
  }
}
