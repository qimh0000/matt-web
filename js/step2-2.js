let mouseMoved = false;
let pointer;
let params;
let trail;
let startTime; // 记录程序开始时间
let fadingStarted = false; // 标记是否开始逐渐消失
let fadeDuration = 5000; // 设定渐隐持续时间，例如5000毫秒（5秒）
let img; // 用於存儲圖像的變量
let colors = ['#edfcf5', '#ffcc73', '#ff9fda', '#cda6dd', '#c0dd9e', '#ff8164', '#f27bff'];
let backgroundFixed = false;  // 用于跟踪背景颜色是否应该固定
let fixedBackgroundColor; 
let startColor;
let endColor;
let colorTransitionDuration = 2000; // 颜色过渡的持续时间，比如2000毫秒
let colorTransitionStart;


function preload() {
  img = loadImage('./img/img0.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  pointer = createVector(0.5 * windowWidth, 0.5 * windowHeight);
  params = {
    pointsNumber: 40,
    widthFactor: 0.3,
    mouseThreshold: 0.5,
    spring: 0.4,
    friction: 0.5
  };
  
  trail = new Array(params.pointsNumber).fill().map(() => ({
    position: createVector(pointer.x, pointer.y),
    velocity: createVector(0, 0)
  }));

  startTime = millis();
  colorTransitionStart = millis();
  startColor = color(colors[0]);
  endColor = color(colors[1]);
}

function mouseDragged() {
  mouseMoved = true;
  pointer.set(mouseX, mouseY);
}

function draw() {
  let currentTime = millis();

  if (!backgroundFixed) {
    if (currentTime - colorTransitionStart > colorTransitionDuration) {
      colorTransitionStart = currentTime;
      // 更新颜色以实现循环渐变
      startColor = endColor;
      endColor = color(colors[Math.floor(Math.random() * colors.length)]);
    }
    let lerpAmt = (currentTime - colorTransitionStart) / colorTransitionDuration;
    let bgColor = lerpColor(startColor, endColor, lerpAmt);
    background(bgColor);

    if (currentTime - startTime > 15000) {
      // 当 trail 完全消失后固定背景颜色
      fixedBackgroundColor = bgColor;
      backgroundFixed = true;
    }
  } else {
    // 固定背景颜色
    background(fixedBackgroundColor);
  }

  if (currentTime - startTime <= 10000) {
    drawTrail(255); // 不透明
  } else if (currentTime - startTime > 10000 && currentTime - startTime <= 15000) {
    let alpha = map(currentTime - startTime, 10000, 15000, 255, 0);
    drawTrail(alpha);
  }
		//image(img, 0,0, 2000, 1200);
}


function drawTrail(alpha) {
  //background(255,129,100);
  clear();
  noFill();

  if (!mouseMoved) {
    let t = millis();
    pointer.x = (0.5 + 0.3 * Math.cos(0.002 * t) * (Math.sin(0.005 * t))) * windowWidth;
    pointer.y = (0.5 + 0.2 * (Math.cos(0.005 * t)) + 0.1 * Math.cos(0.01 * t)) * windowHeight;
  }

  stroke(6,31,255, alpha); // 使用 alpha 值设置透明度
  strokeWeight(1.5);
  beginShape();
  trail.forEach((p, idx) => {
    const prev = idx === 0 ? pointer : trail[idx - 1].position;
    const spring = idx === 0 ? 0.4 * params.spring : params.spring;
    
    p.velocity.x += (prev.x - p.position.x) * spring;
    p.velocity.y += (prev.y - p.position.y) * spring;
    p.velocity.mult(params.friction);
    p.position.add(p.velocity);

    if (idx === 0) {
      vertex(p.position.x, p.position.y);
    } else {
      let xc = 0.5 * (p.position.x + trail[idx - 1].position.x);
      let yc = 0.5 * (p.position.y + trail[idx - 1].position.y);
      quadraticVertex(trail[idx - 1].position.x, trail[idx - 1].position.y, xc, yc);
    }
  });
  endShape();
}