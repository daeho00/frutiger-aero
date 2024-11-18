let bubbles = [];
let particles = [];
let rings = [];
let waveOffset = 0;
let waveSpeed = 0.03;
let waveAmplitude = 50;
let backgroundImage;

function setup() {
  createCanvas(windowWidth, windowHeight);

  backgroundImage = createGraphics(width, height);
  for (let y = 0; y < height; y++) {
    let c = lerpColor(color(100, 180, 220), color(180, 240, 250), y / height);
    backgroundImage.stroke(c);
    backgroundImage.line(0, y, width, y);
  }

  for (let i = 0; i < 10; i++) {
    bubbles.push(new Bubble(random(width), random(height), random(50, 100)));
  }

  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  image(backgroundImage, 0, 0);
  drawWave();

  for (let bubble of bubbles) {
    bubble.reactToMouse();
    bubble.move();
    bubble.display();
  }

  for (let particle of particles) {
    particle.move();
    particle.display();
  }

  for (let ring of rings) {
    ring.expand();
    ring.display();
  }

  rings = rings.filter(ring => !ring.isFinished());
}

class Bubble {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.xSpeed = random(-1, 1);
    this.ySpeed = random(-1, 1);
  }

  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x < 0 || this.x > width) this.xSpeed *= -1;
    if (this.y < 0 || this.y > height) this.ySpeed *= -1;
  }

  reactToMouse() {
    let distance = dist(this.x, this.y, mouseX, mouseY);

    if (distance < 100) {
      this.x += (mouseX - this.x) * 0.02;
      this.y += (mouseY - this.y) * 0.02;
    }
  }

  display() {
    noStroke();
    ellipse(this.x - this.size * 0.2, this.y - this.size * 0.2, this.size * 0.3);
    fill(200, 220, 255, 150);
    ellipse(this.x, this.y, this.size);
    fill(255, 255, 255, 100);
    ellipse(this.x, this.y, this.size * 0.8);
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xSpeed = random(-0.5, 0.5);
    this.ySpeed = random(-0.5, 0.5);
  }

  move() {
    let distance = dist(this.x, this.y, mouseX, mouseY);

    if (distance < 100) {
      this.x += this.xSpeed * 3;
      this.y += this.ySpeed * 3;
    } else {
      this.x += this.xSpeed;
      this.y += this.ySpeed;
    }

    if (this.x < 0 || this.x > width) {
      this.xSpeed *= -1;
      this.x = constrain(this.x, 0, width);
    }
    if (this.y < 0 || this.y > height) {
      this.ySpeed *= -1;
      this.y = constrain(this.y, 0, height);
    }
  }

  display() {
    noStroke();
    let distance = dist(this.x, this.y, mouseX, mouseY);
    let alpha = distance < 100 ? 255 : random(100, 200);
    fill(255, 255, 255, alpha);
    ellipse(this.x, this.y, 5, 5);
  }
}

class EnergyRing {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.alpha = 255;
  }

  expand() {
    this.radius += 2;
    this.alpha -= 5;
  }

  isFinished() {
    return this.alpha <= 0;
  }

  display() {
    noFill();
    stroke(255, 255, 255, this.alpha);
    strokeWeight(2);
    ellipse(this.x, this.y, this.radius);
  }
}

function drawWave() {
  noFill();
  stroke(255, 255, 255, 150);
  strokeWeight(2);
  beginShape();
  for (let x = 0; x < width; x++) {
    let y = height / 2 + sin(x * 0.02 + waveOffset) * waveAmplitude;
    vertex(x, y);
  }
  endShape();
  waveOffset += waveSpeed;
}

function mouseMoved() {
  let constrainedX = constrain(mouseX, 0, width);
  let constrainedY = constrain(mouseY, 0, height);
  waveSpeed = map(constrainedX, 0, width, 0.01, 0.1);
  waveAmplitude = map(constrainedY, 0, height, 20, 100);
  rings.push(new EnergyRing(mouseX, mouseY));
}
