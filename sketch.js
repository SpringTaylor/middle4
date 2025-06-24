let defaultImg, wImg, aImg, sImg, dImg, bgImg, bgImg2, bgImg3, bgImg4;
let currentImg;
let img1Alpha = 255;
let img1FadeStart;
let img1FadedOut = false;

let cols = 7;
let spacingX = 300;
let spacingY = 60;
let horizontalLines = [];
let verticalLines = [];
let moveSpeed = 4;
let vanishingPoint;
let cutoffY;
let extension = 30;
let displayTop = 500;
let displayBottom = 1080;

function preload() {
  defaultImg = loadImage('wasd3.png');
  wImg = loadImage('W3.png');
  aImg = loadImage('A3.png');
  sImg = loadImage('S3.png');
  dImg = loadImage('D3.png');
  bgImg = loadImage('1.png');
  bgImg2 = loadImage('2.png');
  bgImg3 = loadImage('3.png');
  bgImg4 = loadImage('4.png');
}

function setup() {
  createCanvas(1920, 1080);
  currentImg = defaultImg;
  vanishingPoint = createVector(width / 2, 360);
  cutoffY = height / 2;
  img1FadeStart = millis() + 4000; // 4秒后开始淡出
  initGrid();
}

function draw() {
  background(255);

  // 最底层绘制网格
  drawVerticalLines();
  updateAndDrawHorizontalLines();

  // 显示背景图片2.png（最底层）
  image(bgImg2, 0, 0, width, height);

  // 显示背景图片3.png（1.png下层，2.png上层）
  image(bgImg3, 0, 0, width, height);

  image(currentImg, 0, 0, width, height);

  // 控制1.png淡出
  if (millis() > img1FadeStart && img1Alpha > 0) {
    img1Alpha = max(0, img1Alpha - 5); // 缓慢淡出
  }
  // 判断1.png是否完全淡出
  if (img1Alpha === 0) {
    img1FadedOut = true;
  }

  // 如果1.png未完全淡出，绘制它
  if (!img1FadedOut) {
    tint(255, img1Alpha);
    image(bgImg, 0, 0, width, height);
    noTint();
  } else {
    // 1.png完全淡出后显示4.png
    image(bgImg4, 0, 0, width, height);
  }
}

function initGrid() {
  horizontalLines = [];
  verticalLines = [];
  for (let y = height; y >= vanishingPoint.y; y -= spacingY) {
    horizontalLines.push(y);
  }
  for (let i = 0; i < cols; i++) {
    let x = width / 2 - ((cols - 1) / 2) * spacingX + i * spacingX;
    verticalLines.push(x);
  }
}

function drawVerticalLines() {
  stroke(178);
  for (let x of verticalLines) {
    let dx = vanishingPoint.x - x;
    let dy = vanishingPoint.y - height;
    let ratio = (cutoffY - height) / dy;
    let cutoffX = x + dx * ratio;
    let cutoffYLine = height + dy * ratio;
    let extendedY = cutoffYLine + extension;
    if (extendedY >= displayTop && height <= displayBottom) {
      line(x, height, cutoffX, extendedY);
    }
  }
}

function updateAndDrawHorizontalLines() {
  if (keyIsDown(83)) { // S key
    for (let i = 0; i < horizontalLines.length; i++) {
      horizontalLines[i] += moveSpeed;
    }
    if (horizontalLines[0] > height) {
      horizontalLines.push(horizontalLines.shift() - (horizontalLines.length - 1) * spacingY);
    }
  }

  if (keyIsDown(87)) { // W key
    for (let i = 0; i < horizontalLines.length; i++) {
      horizontalLines[i] -= moveSpeed;
    }
    if (horizontalLines[horizontalLines.length - 1] < vanishingPoint.y) {
      horizontalLines.unshift(horizontalLines.pop() + (horizontalLines.length - 1) * spacingY);
    }
  }

  let visibleLines = horizontalLines.filter(y => y >= vanishingPoint.y && y <= height && y >= displayTop && y <= displayBottom);
  let minY = min(visibleLines);

  for (let y of visibleLines) {
    if (y === minY) continue;
    let shrink = map(y, height, vanishingPoint.y, 0, 1);
    let halfWidth = ((cols - 1) / 2) * spacingX;
    let left = lerp(width / 2 - halfWidth, vanishingPoint.x, shrink);
    let right = lerp(width / 2 + halfWidth, vanishingPoint.x, shrink);
    line(left, y, right, y);
  }
}

function keyPressed() {
  updateCurrentImage(key);
}

function keyReleased() {
  if ('wasdWASD'.includes(key)) {
    currentImg = defaultImg;
  }
}

function updateCurrentImage(k) {
  switch (k.toLowerCase()) {
    case 's': currentImg = wImg; break;
    case 'a': currentImg = aImg; break;
    case 'w': currentImg = sImg; break;
    case 'd': currentImg = dImg; break;
  }
}
