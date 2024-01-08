let img;
let button; // variable for the button
let showImage = false; // toggle state
let imgX, imgY; // 图像的位置

function preload() {
  img = loadImage('img/img1.png'); // load your image
}

function setup() {
  const mycanvas = createCanvas(windowWidth, windowHeight);
  mycanvas.parent("canvas4");
  imgX = windowWidth / 2; // 初始化图像位置为画布中心
  imgY = windowHeight / 2;

  button = createButton('Off'); // create a button with initial label 'Off'
  button.position(19, 19); // position the button
  button.mousePressed(toggleImage);
}

function draw() {
  background(145); // 清除画布

  // 显示多边形
  drawSavedPolygon();

  // 如果 showImage 为 true，则显示图像
  if (showImage) {
    imageMode(CENTER);
    image(img, imgX, imgY, 1200*5/6, 675*5/6); // 使用 imgX 和 imgY 作为图像位置
  }
}

function toggleImage() {
  showImage = !showImage; // toggle the state
  button.html(showImage ? 'On' : 'Off'); // update the button label based on the state
}

function drawSavedPolygon() {
  // 从 localStorage 读取带有过期时间的坐标
  let dataWithExpiration = loadDataWithExpiration("polygonVertices");
  if (dataWithExpiration) {
    fill(240);
    noStroke(0);
    //strokeWeight(2);
    beginShape();
    for (let v of dataWithExpiration) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
}

function keyPressed() {
  let speed = 5; // 设置移动速度
  if (keyCode === LEFT_ARROW) {
    imgX -= speed; // 向左移动
  } else if (keyCode === RIGHT_ARROW) {
    imgX += speed; // 向右移动
  } else if (keyCode === UP_ARROW) {
    imgY -= speed; // 向上移动
  } else if (keyCode === DOWN_ARROW) {
    imgY += speed; // 向下移动
  }
}

function loadDataWithExpiration(key) {
  let dataWithExpiration = JSON.parse(localStorage.getItem(key));
  if (dataWithExpiration) {
    const now = new Date().getTime();
    if (now < dataWithExpiration.expires) {
      return dataWithExpiration.value;
    } else {
      localStorage.removeItem(key); // 数据过期，清除存储
      return null;
    }
  }
  return null; // 数据不存在
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function doubleClicked() {
  saveCanvas('custom', 'jpg');
}
