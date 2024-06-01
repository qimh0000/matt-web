let img; 
let img1; // 变量用于存储图像
let button; // 按钮变量
let showImage = false; 
let showImage1 = false;// 切换状态
let imgX, imgY; // 图像的位置
let myw = 540;
let myh = 960;
let seeds_x = [];
let seeds_y = [];
let seed_colors = [];
let voronoiGraphics; // 用于Voronoi的图形对象
let imageGraphics; // 用于图像和多边形的图形对象
let pressTimer;
let input1;
let button1;
let button2;
let label1;
let madlibText = ''; // 用于保存 Madlib 文本内容
let lastDragX, lastDragY;


function preload() {
  img = loadImage('./img/img5.png');
	 img1 = loadImage('./img/img6.png');// 加载你的图像
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imgX = windowWidth/2;
  imgY = windowHeight/2;
  voronoiGraphics = createGraphics(windowWidth+540, windowHeight+960);
  imageGraphics = createGraphics(windowWidth, windowHeight);
  
  button = createButton('Off');
  button.position(25, 160);
	button.size(45, 30);
	button.style('border-radius','6px')
  button.mousePressed(toggleImage);
	
	  button2 = createButton('Off');
  button2.position(25, 120);
	button2.size(45, 30);
	button2.style('border-radius','6px')
  button2.mousePressed(toggleImage1);
  //noLoop();

	//textSize(25)
	//input1 = createInput('')
	//input1.position(20,40)
	//input1.size(100)
	
	//label1 = createDiv('Name')
	//label1.position(20,20)
	//label1.style('font-size','16px')
	
	//button1 = createButton('Print')
	//button1.position(20,80)
	//button1.size(50,30)
	//button1.style('border-radius','6px')
	//button1.mousePressed(printMadlib)
	//noLoop();
	let saveButton = createButton('Save');
  saveButton.position(25, 200); // Place it below the toggle button
  saveButton.size(45, 30);
  saveButton.style('border-radius', '6px');
  saveButton.mousePressed(() => saveCanvas('Motivation', 'png'));
	
	 let moveLeftButton = createButton('<');
  moveLeftButton.position(5, 280);
  moveLeftButton.mousePressed(() => {
    imgX -= 10; 
    redraw();
  });

  let moveRightButton = createButton('>');
  moveRightButton.position(63, 280);
  moveRightButton.mousePressed(() => {
    imgX += 10;
    redraw();
  });

  let moveUpButton = createButton('^');
  moveUpButton.position(35, 250);
  moveUpButton.mousePressed(() => {
    imgY -= 10;
    redraw();
  });

  let moveDownButton = createButton('v');
  moveDownButton.position(35, 310);
  moveDownButton.mousePressed(() => {
    imgY += 10;
    redraw();
  });
	
  seed_colors.push(color(random(255), random(255), random(255)));
  seeds_x.push(random(10, myw - 20));
  seeds_y.push(random(10, myh - 20));
  
  generateVoronoi();
}

function draw() {
  background(230);
  generateVoronoi();

  imageGraphics.clear();

  drawSavedPolygon(imageGraphics);
  imageMode(CENTER);
  image(voronoiGraphics, windowWidth, windowHeight);
  
  image(imageGraphics, windowWidth / 2, windowHeight / 2);
  if (showImage) {
    imageMode(CENTER);
    image(img, imgX, imgY, 240,120); // 调整大小参数以适应你的需要
  }
	if (showImage1) {
    imageMode(CENTER);
    image(img1, imgX, imgY, 350,180); // 调整大小参数以适应你的需要
  }
  
  // 在最后绘制 madlibText，确保它显示在最上层
  fill(255,129,100); // 设置文本颜色
  textSize(24); // 设置文本大小
  //textWrap(WORD);
	textAlign(CENTER);
	textStyle(BOLD);
	fill(0,43,255);
	textLeading(30);
  text(madlibText, windowWidth / 2, 5, 10); // 绘制文本
	
}

function mouseDragged() {
    // 只有当鼠标移动超过一定距离时才更新位置
    if (showImage && (abs(mouseX - lastDragX) > 3 || abs(mouseY - lastDragY) > 3)) {
        imgX = mouseX;
        imgY = mouseY;
        lastDragX = mouseX;
        lastDragY = mouseY;
        redraw();
    }
}

function mousePressed() {
  // 检查当前种子点的数量是否小于 7
  if (seeds_x.length < 7) {
    // 仅当鼠标点击在指定区域内时，添加新的种子点
    if (mouseX > 100 && mouseX < 2000 && mouseY > 20 && mouseY < 1000) {
      seeds_x.push(mouseX);
      seeds_y.push(mouseY);
      seed_colors.push(color('#edfcf5'));
      seed_colors.push(color('#ffcc73'));
      seed_colors.push(color('#ff9fda'));
      seed_colors.push(color('#cda6dd'));
      seed_colors.push(color('#c0dd9e'));
      seed_colors.push(color('#ff8164'));
      seed_colors.push(color('#f27bff'));
      redraw();  // 重新绘制画布，以显示新添加的种子点
    }
  }
}


function generateVoronoi() {
  voronoiGraphics.strokeWeight(8);
  let stepSize = 9; // Reduce resolution by using a step size greater than 1
  for (let px = 0; px < myw; px += stepSize) {
    for (let py = 0; py < myh; py += stepSize) {
      let minDistance = Infinity;
      let minIndex = 0;

      for (let nc = 0; nc < seeds_x.length; nc++) {
        let dist = sq(px - seeds_x[nc]) + sq(py - seeds_y[nc]);
        if (dist < minDistance) {
          minDistance = dist;
          minIndex = nc;
        }
      }
      voronoiGraphics.stroke(seed_colors[minIndex]);
      voronoiGraphics.point(px, py); // Or use rect(px, py, stepSize, stepSize) for larger "pixels"
    }
  }
}


function drawSavedPolygon(pg) {
  let dataWithExpiration = loadDataWithExpiration("polygonVertices");
  if (dataWithExpiration) {
    pg.stroke(color(114,107,249));
    pg.strokeWeight(1);
		pg.fill(255,129,100);
    //pg.noFill();
    pg.beginShape();
    for (let v of dataWithExpiration) {
      pg.vertex(v.x, v.y);
    }
    pg.endShape(CLOSE);
  }
}

function loadDataWithExpiration(key) {
  let dataWithExpiration = JSON.parse(localStorage.getItem(key));
  if (dataWithExpiration) {
    const now = new Date().getTime();
    if (now < dataWithExpiration.expires) {
      return dataWithExpiration.value;
    } else {
      localStorage.removeItem(key);
      return null;
    }
  }
  return null;
}
function toggleImage() {
  showImage = !showImage;
  button.html(showImage ? 'On' : 'Off');
  redraw();
}
function toggleImage1() {
  showImage1 = !showImage;
  button2.html(showImage1 ? 'On' : 'Off');
  redraw();
}
function printMadlib() {
  madlibText = 'Keep Going ' +'\n' +input1.value() ;
  redraw(); }



