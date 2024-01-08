let startTime;
let pressTime = 0; // 滑鼠按壓的開始時間
let duration = 0; // 按壓的持續時間
let displayTime = 0; // 要顯示的時間
let showTime = false; // 是否顯示計時結果
let ball;
let dragging = false;
let timerRunning = true; // 控制計時器是否運行的變量
let showBall = true; // 控制圓形是否顯示的變量
let img,img4;
let circles = []; // 用於存儲額外圓形的陣列
let mousePressedFlag = false;
let lastCircleTime = 0; // 跟踪上次添加圓形的時間
let circleInterval = 500; // 圓形添加的間隔時間（毫秒）

function preload() {
  img = loadImage('img/img1.png'); 
	img4 = loadImage('img/img4.png');// load your image
}

function setup() {
  const mycanvas = createCanvas(windowWidth, windowHeight);
  mycanvas.parent("canvas1");
  ball = createVector(width / 2+10, height * 0.8);
}

function draw() {
  background(145);
   let currentTime = millis();

  // 繪製圓形
	 if (mousePressedFlag) {
    duration = currentTime - pressTime;
    displayTime = Math.min(7, Math.floor(duration / 1000)); // 限制時間到7秒
  }
  if (mousePressedFlag && currentTime - lastCircleTime > circleInterval) {
    let newCircle = {
      x: random(width),
      y: random(height),
      size: random(10, 500),
      color: color(random(255), random(255), random(255), random(255))
    };
    circles.push(newCircle);
    lastCircleTime = currentTime; // 更新上次添加圓形的時間
  }

  // 繪製流動的圓形
 if (mousePressedFlag) {
    let newCircle = {
      x: random(width),
      y: random(height),
      size: random(10, 500),
stroke:noStroke(),
      color: color(random(255), random(255), random(255), random(255))
    };
    circles.push(newCircle);
  }

  // 繪製所有圓形
  for (let i = 0; i < circles.length; i++) {
    fill(circles[i].color);
    ellipse(circles[i].x, circles[i].y, circles[i].size);
  }

 if (showTime) {
    textSize(800);
	 textAlign(CENTER,CENTER);
    fill(36);
    text(displayTime, width / 2, height / 2);
  }
  push();
  imageMode(CENTER);
  image(img, windowWidth/2, windowHeight/2-300, 800, 450);
  pop();
	 if (showBall) {
    imageMode(CENTER);
    image(img4, ball.x, ball.y, 400, 400); // 繪製圖片
  }
}

function mousePressed() {
	mousePressedFlag = true;

  pressTime = millis(); // 記錄按壓開始的時間
  let d = dist(mouseX, mouseY, ball.x, ball.y);
  if (d < 25) {
    dragging = true;
  } else {
    // 添加新的流動圓形
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
  mousePressedFlag = false;
showTime = true; 
    dragging = false;
    timerRunning = false; // 滑鼠釋放時暫停計時器
    showBall = false; // 滑鼠釋放時隱藏圓形

    // 清空所有按壓滑鼠時產生的圓形
    circles = [];
  
}

function mouseDragged() {
  if (dragging) {
    ball.x = mouseX;
    ball.y = mouseY;
  }
}

