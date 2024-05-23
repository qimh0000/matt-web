let numSidesSlider;
let lastSliderValue;
let polygonVertices = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  numSidesSlider = createSlider(3, 10, 5, 0.1);
  numSidesSlider.position(windowWidth / 2 - 50, windowHeight * 7 / 8);
  lastSliderValue = numSidesSlider.value();
  drawPolygon();
}

function draw() {
	//rect(windowWidth/2, windowHeight/2,800,450);
	//rectMode(CENTER);
  if (numSidesSlider.value() !== lastSliderValue) {
    lastSliderValue = numSidesSlider.value();
    drawPolygon();
  }
}

function drawPolygon() {
  background(230);
  fill(255,129,100);
  noStroke();

  let numSides = lastSliderValue;
  let centerX = width / 2-5;
  let centerY = height / 2-50;
  let radius = 160;

  polygonVertices = [];

  beginShape();
  for (let i = 0; i < numSides; i++) {
    let angle = map(i, 0, numSides, 0, TWO_PI);
    let randomRadius = radius * 2 / 3 + random(-100, 100);
    let x = centerX + randomRadius * cos(angle);
    let y = centerY + randomRadius * sin(angle);
    vertex(x, y);
    polygonVertices.push({ x: x, y: y });
  }
  endShape(CLOSE);

  // 在多边形绘制完成后显示坐标
  for (let v of polygonVertices) {
    displayCoordinates(v.x, v.y);
  }

  // 保存带有过期时间的坐标到 localStorage
  saveDataWithExpiration("polygonVertices", polygonVertices);
}

function displayCoordinates(x, y) {
  push();
  fill(0,43,255);
  textSize(10);
  textAlign(LEFT, CENTER);
  text(`(${x.toFixed(2)}, ${y.toFixed(2)})`, x + 10, y);
  pop();
}

function saveDataWithExpiration(key, data) {
  const now = new Date().getTime();
  const expirationTime = now + 24 * 60 * 60 * 1000; // 当前时间加上一天的毫秒数

  const dataWithExpiration = {
    value: data,
    expires: expirationTime
  };

  localStorage.setItem(key, JSON.stringify(dataWithExpiration));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  numSidesSlider.position(windowWidth / 2 - 50, windowHeight * 7 / 8);
  drawPolygon();
}
