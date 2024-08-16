/******CONSTANTS*******/
const canvas = getCanvas();
const ctx = canvas.getContext("2d");
const highScoreText = document.getElementById("high-score");
const scoreText = document.getElementById("score");

let newDirection = "right", oldDirection = "right";
let speed = 0, highScore = 0, food;
let body = [];
const snakeBody = createSnake(3);

function getCanvas() {
  // Select the game canvas
  const canvas = document.querySelector("#game-canvas");
  return canvas;
}

function setCanvasSize() {
  const parent = canvas.parentNode;

  canvas.width = parent.offsetWidth;
  canvas.width += (30 - (canvas.width % 30)) % 30;

  canvas.height = parent.offsetHeight;
  canvas.height += (30 - (canvas.height % 30)) % 30;
}

function getCanvasSize() {
  return {
    width: canvas.width,
    height: canvas.height,
  };
}

function clearScreen() {
  const { width, height } = getCanvasSize();
  ctx.clearRect(0, 0, width, height);
}

function drawSquare(x, y, size, fill, borderWidth = 2, radius = 3) {
  ctx.fillStyle = fill;
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = "black";

  // Begin path for rounded rectangle
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + size - radius, y);
  ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
  ctx.lineTo(x + size, y + size - radius);
  ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
  ctx.lineTo(x + radius, y + size);
  ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  // Fill the rectangle
  ctx.fill();

  // Stroke the rectangle border
  ctx.stroke();
}

function createSnake(tall) {
  let length;
  body = [{ x: 300, y: 300, newDirection: "right" }];
  for (let i = 0; i < tall; i++) {
    length = body.length - 1;
    body.push({ x: body[length].x - 30,
                y: body[length].y,
                newDirection: "right",
             });
  }
  newDirection = oldDirection = "right";
  food = drawFood();
}

function move() {
  for (let h = 0; h < body.length; h++) {
    if (body[h].newDirection === "right") {
      body[h].x += speed;
    } else if (body[h].newDirection === "left") {
      body[h].x -= speed;
    } else if (body[h].newDirection === "up") {
      body[h].y -= speed;
    } else if (body[h].newDirection === "down") {
      body[h].y += speed;
    }
  }
}

function isDead() {
  const { width, height } = getCanvasSize();
  if (  body[0].x < -25 || body[0].x > width - 5 ||
        body[0].y < -25 || body[0].y > height - 5){
    createSnake(3);
  } else {
    for (let h = 3; h < body.length; h++) {
      if (  Math.abs(body[0].x - body[h].x) < 30 &&
            Math.abs(body[0].y - body[h].y) < 30)
            { createSnake(3); break; }
    }
  }
}

function testNewDirection() {
  let i = 0;
  while ( i < body.length - 2 && body[i].newDirection == body[i + 1].newDirection){
    i++;
  }
  if (( body[i].x == body[i + 1].x || body[i].y == body[i + 1].y) &&
        body[0].x % 30 == 0 && body[0].y % 30 == 0){
        return true;
  } else {
    return false;
  }
}

function update() {
  if (body[0].newDirection != newDirection) {
    if (testNewDirection()) {
      for (let h = body.length - 1; h > 0; h--) {
        if (body[h].x == body[h - 1].x || body[h].y == body[h - 1].y) {
          body[h].newDirection = body[h - 1].newDirection;
        }
      }
      body[0].newDirection = newDirection;
      oldDirection = newDirection;
      move();
      isDead();
    } else {
      move();
      isDead();
    }
  } else {
    newDirection = oldDirection;
    for (let h = body.length - 1; h > 0; h--) {
      if (body[h].x == body[h - 1].x || body[h].y == body[h - 1].y) {
        body[h].newDirection = body[h - 1].newDirection;
      }
    }
    move();
    isDead();
  }
}

function drawFood() {
  let y1 = body[0].y,
    x1 = body[0].x;
  const { width, height } = getCanvasSize();
  while (body[0].x == x1 || body[0].y == y1) {
    x1 = Math.floor(Math.random() * Math.floor(width / 30)) * 30;
    y1 = Math.floor(Math.random() * Math.floor(height / 30)) * 30;
  }
  return { x: x1, y: y1 };
}

function addToBody() {
  let length = body.length;
  if (body[length - 1].newDirection == "right") {
    newBody = {
      x: body[length - 1].x - 30,
      y: body[length - 1].y,
      newDirection: "right",
    };
  } else if (body[length - 1].newDirection == "left") {
    newBody = {
      x: body[length - 1].x + 30,
      y: body[length - 1].y,
      newDirection: "left",
    };
  } else if (body[length - 1].newDirection == "up") {
    newBody = {
      x: body[length - 1].x,
      y: body[length - 1].y + 30,
      newDirection: "up",
    };
  } else if (body[length - 1].newDirection == "down") {
    newBody = {
      x: body[length - 1].x,
      y: body[length - 1].y - 30,
      newDirection: "down",
    };
  }
  body.push(newBody);
}

function renderGame() {
  // Clear screen
  clearScreen();

  // Draw game
  drawSquare(body[0].x, body[0].y, 30, "white");
  for (let h = 1; h < body.length; h++) {
    drawSquare(body[h].x, body[h].y, 30, "black");
  }
  scoreText.innerHTML = `${body.length}`;
  if (body[0].x == food.x && body[0].y == food.y) {
    food = drawFood();
    addToBody();
    scoreText.innerHTML = `${body.length}`;
    if (highScore < body.length) {
      highScore = body.length;
      highScoreText.innerHTML = `${body.length}`;
    }
  }

  drawSquare(food.x, food.y, 30, "red");
}

function gameLoop() {
  // Main game
  update();
  renderGame();

  // End calls
  window.requestAnimationFrame(gameLoop);
}

function main() {
  // Set canvas width & height automatically
  setCanvasSize();
  window.addEventListener("resize", () => {
    setCanvasSize();
  });

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight":
        if (oldDirection != "left" && oldDirection != "right") {
          newDirection = "right";
        }
        break;

      case "ArrowLeft":
        if (oldDirection != "right" && oldDirection != "left") {
          newDirection = "left";
        }
        break;

      case "ArrowUp":
        if (oldDirection != "down" && oldDirection != "up") {
          newDirection = "up";
        }
        break;

      case "ArrowDown":
        if (oldDirection != "down" && oldDirection != "up") {
          newDirection = "down";
        }
        break;
    }
  });

  document.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "a": addToBody(); break;
      case "A": addToBody(); break;
      
      case "r": if (body.length > 2) { body.pop()}; break;
      case "R": if (body.length > 2) { body.pop()}; break;

      case "s":createSnake(3); speed = 5; break;
      case "S":createSnake(3); speed = 5; break;
      
      case "f":createSnake(3); speed = 10; break;
      case "F":createSnake(3); speed = 10; break;
      
      case "T":createSnake(3); speed = 15; break;
      case "t":createSnake(3); speed = 15; break;
    }
  });

  // Run game
  window.requestAnimationFrame(gameLoop);
}

/****Main call*****/
main();
