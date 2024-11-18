let bubbles = [];
let particles = [];
let rings = [];
let waveOffset = 0;
let waveSpeed = 0.03;
let waveAmplitude = 50;

function setup() {
  createCanvas(800, 600);

  // 구슬 초기화
  for (let i = 0; i < 10; i++) {
    bubbles.push(new Bubble(random(width), random(height), random(50, 100)));
  }

  // 입자 초기화
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  drawGradientBackground();
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

  // 에너지 링 배열에서 사라진 링 제거
  rings = rings.filter(ring => !ring.isFinished());
}

// 구슬 클래스
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
      // 마우스 근처에서 구슬이 마우스를 따라감
      this.x += (mouseX - this.x) * 0.02;
      this.y += (mouseY - this.y) * 0.02;
    }
  }

  display() {
    let distanceToMouse = dist(this.x, this.y, mouseX, mouseY);
    let reflectIntensity = map(distanceToMouse, 0, 200, 255, 50); // 마우스와의 거리로 반사 밝기 조정

    noStroke();
    // 반사 효과
    
    ellipse(this.x - this.size * 0.2, this.y - this.size * 0.2, this.size * 0.3);

    // 메인 구슬
    fill(200, 220, 255, 150);
    ellipse(this.x, this.y, this.size);

    // 투명한 중심
    fill(255, 255, 255, 100);
    ellipse(this.x, this.y, this.size * 0.8);
  }
}

// 입자 클래스
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xSpeed = random(-0.5, 0.5);
    this.ySpeed = random(-0.5, 0.5);
  }

  move() {
    let distance = dist(this.x, this.y, mouseX, mouseY);

    // 마우스와 가까운 입자는 더 빠르게 움직임
    if (distance < 100) {
      this.x += this.xSpeed * 3;
      this.y += this.ySpeed * 3;
    } else {
      this.x += this.xSpeed;
      this.y += this.ySpeed;
    }

    if (this.x < 0 || this.x > width) this.xSpeed *= -1;
    if (this.y < 0 || this.y > height) this.ySpeed *= -1;
  }

  display() {
    noStroke();
    let distance = dist(this.x, this.y, mouseX, mouseY);
    let alpha = distance < 100 ? 255 : random(100, 200); // 마우스 근처에서 더 밝음
    fill(255, 255, 255, alpha);
    ellipse(this.x, this.y, 5, 5);
  }
}

// 에너지 링 클래스
class EnergyRing {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.alpha = 255;
  }

  expand() {
    this.radius += 2; // 크기 증가
    this.alpha -= 5;  // 투명도 감소
  }

  isFinished() {
    return this.alpha <= 0; // 완전히 사라지면 제거
  }

  display() {
    noFill();
    stroke(255, 255, 255, this.alpha);
    strokeWeight(2);
    ellipse(this.x, this.y, this.radius);
  }
}

// 배경 그라데이션
function drawGradientBackground() {
  for (let y = 0; y < height; y++) {
    let c = lerpColor(color(100, 180, 220), color(180, 240, 250), y / height);
    stroke(c);
    line(0, y, width, y);
  }
}

// 파도 애니메이션
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

// 마우스 이동에 따라 파도 속도와 진폭 조정, 에너지 링 생성
function mouseMoved() {
  waveSpeed = map(mouseX, 0, width, 0.01, 0.1); // X 위치에 따라 속도 변화
  waveAmplitude = map(mouseY, 0, height, 20, 100); // Y 위치에 따라 진폭 변화

  // 에너지 링 생성
  rings.push(new EnergyRing(mouseX, mouseY));
}
