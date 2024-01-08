let mouseMoved = false;
let pointer;
let params;
let trail;

function setup() {
  const mycanvas = createCanvas(windowWidth, windowHeight);
  mycanvas.parent("canvas2");
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

  // Event listeners
  window.addEventListener("mousemove", e => {
    mouseMoved = true;
    pointer.set(e.pageX, e.pageY);
  });
  window.addEventListener("touchmove", e => {
    mouseMoved = true;
    pointer.set(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
  });
}

function draw() {
	 // set background color
  background(145);
  let t = millis();

  if (!mouseMoved) {
    pointer.x = (0.5 + 0.3 * Math.cos(0.002 * t) * (Math.sin(0.005 * t))) * windowWidth;
    pointer.y = (0.5 + 0.2 * (Math.cos(0.005 * t)) + 0.1 * Math.cos(0.01 * t)) * windowHeight;
  }

  clear();
  noFill();
  stroke(random(230,240));
  strokeWeight(3);
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

