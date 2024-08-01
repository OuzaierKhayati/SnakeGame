/******CONSTANTS*******/
const Medium = document.getElementById("Medium");
const Hard = document.getElementById("Hard");
const Easy = document.getElementById("Easy");
const highScore = document.getElementById("high-score");
const Score = document.getElementById("score");

const canvas = getCanvas();
const ctx = canvas.getContext("2d");
let newDirection = "right", oldDirection = "right";
let v =0;// it should be{1,2,3,5,10,}
let food = {x:700,y:300}
let highscore=0;

let body = [{ x: 700, y: 300, newDirection: "right"}, { x: 670, y: 300, newDirection: "right"}, { x: 640, y: 300, newDirection: "right"}, { x: 610, y: 300, newDirection: "right"}, { x: 580, y: 300, newDirection: "right"}, { x: 550, y: 300, newDirection: "right"}]//{x:930,y:10, newDirection:"right", oldDirection:"right"}];
//bodys.forEach(console.log(body.x));


function getCanvas() {
    // Select the game canvas
    const canvas = document.querySelector("#game-canvas");
    return canvas;
}

function setCanvasSize() {
    const parent = canvas.parentNode;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
}

function getCanvasSize() {
    return {
        width: canvas.width,
        height: canvas.height
    }
}

function clearScreen() {
    const { width, height } = getCanvasSize();
    ctx.clearRect(0, 0, width, height);
}

function drawSquare(x, y, size, fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, size, size);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, size, size);
    
}

// moving diretion
function moveRight(h) {

    let { width } = getCanvasSize();
    while(width % 30 !=0){
        width++;
    }
    body[h].x += v;
    if (body[h].x >= width) {
        body[h].x = -30;
    }
}

function moveLeft(h) {

    let { width } = getCanvasSize();
    while(width % 30 !=0){
        width++;
    }
    body[h].x -= v;
    if (body[h].x <=-30) {
        body[h].x = width;
    }
}

function moveUp(h) {

    let { height } = getCanvasSize();
    while(height % 30 !=0){
        height++;
    }
    body[h].y -= v;
    if (body[h].y <= -30) {
        body[h].y = height;
    }
}

function moveDown(h) {

    let { height } = getCanvasSize();
    while(height % 30 !=0){
        height++;
    }
    body[h].y += v;
    if (body[h].y >= height) {
        body[h].y = -30;
    }
}


function move() {

    for (let h = 0; h < body.length; h++) {
        if (body[h].newDirection === "right") {
            moveRight(h);

        } else if (body[h].newDirection === "left") {
            moveLeft(h);

        } else if (body[h].newDirection === "up") {
            moveUp(h);

        } else if (body[h].newDirection === "down") {
            moveDown(h);

        }
    }

}


///////////////////////
function isDead(){
    for (let h=4; h<body.length; h++){
        if (Math.abs(body[0].x-body[h].x)<30 && Math.abs(body[0].y-body[h].y)<30){
            body = [{ x: 700, y: 300, newDirection: "right"}, { x: 670, y: 300, newDirection: "right"}, { x: 640, y: 300, newDirection: "right"}, { x: 610, y: 300, newDirection: "right"}, { x: 580, y: 300, newDirection: "right"}, { x: 550, y: 300, newDirection: "right"}];
            newDirection=oldDirection="right";
            break;
        }
    }

}

function testNewDirection(){
    let i =0 ;
    while (body[i].newDirection == body[i+1].newDirection && i<body.length-2){
        i++;
    }
    if ((body[i].x == body[i+1].x || body[i].y == body[i+1].y) && body[0].x%30==0 && body[0].y%30==0){
        return true;
    }
    else {return false;}
}

function changePosition() {

    if ( body[0].newDirection != newDirection){
        if (testNewDirection()){
            for (let h=body.length-1; h>0; h--){
                if (body[h].x == body[h-1].x || body[h].y == body[h-1].y){
                    body[h].newDirection=body[h-1].newDirection;}
            }
            body[0].newDirection=newDirection;
            oldDirection = newDirection;
            move();
            //testHeadPosition();
            isDead();
        }
        else {
            move();
            isDead();
            //testHeadPosition();
        }
    }
    else { newDirection=oldDirection;
        for (let h=body.length-1; h>0; h--){
            if (body[h].x == body[h-1].x || body[h].y == body[h-1].y){
            body[h].newDirection=body[h-1].newDirection;}
        }
        move();
        //testHeadPosition();
        isDead();
    }

}

function drawFood(){
    let y1=body[0].y,x1=body[0].x;
    const {width, height}= getCanvasSize();
    while (body[0].x==x1 || body[0].y==y1 ){
        x1 = Math.floor(Math.random()*Math.floor(width/30))*30;
        y1 = Math.floor(Math.random()*Math.floor(height/30))*30;

    }      
    return {x:x1,y:y1};
}

function addToBody(){
    let length = body.length;
        if (body[length-1].newDirection == "right" ){
            newBody = {x:body[length-1].x-30, y:body[length-1].y,newDirection:"right" }
        
        }else if (body[length-1].newDirection == "left" ){
            newBody = {x:body[length-1].x+30, y:body[length-1].y,newDirection:"left" }
        
        }else if (body[length-1].newDirection == "up" ){
            newBody = {x:body[length-1].x, y:body[length-1].y+30,newDirection:"up" }
        }else if (body[length-1].newDirection == "down" ){
            newBody = {x:body[length-1].x, y:body[length-1].y-30,newDirection:"down" }
        }

        body.push(newBody);
}

function renderGame() {

    // Clear screen
    clearScreen();

    // Draw game

    drawSquare(body[0].x, body[0].y, 30, 'white');
    for (let h = 1; h < body.length; h++) {
        drawSquare(body[h].x, body[h].y, 30, 'black');
    }
    Score.innerHTML = `${body.length}`
    if (body[0].x==food.x && body[0].y==food.y){
        food = drawFood();
        addToBody();
        Score.innerHTML = `${body.length}`
        if (highscore<body.length){
            highScore.innerHTML = `${body.length}`
        }
    }
    //food=drawFood();
    drawSquare(food.x, food.y, 30, "red");
}

function gameLoop() {
    // Main game
    changePosition();
    renderGame();
    

    // End calls
    window.requestAnimationFrame(gameLoop);
}


function main() {
    // Set canvas width & height automatically
    setCanvasSize();
    window.addEventListener('resize', () => {
        setCanvasSize();
    })

    document.addEventListener("keyup", (e) => {
        switch (e.key) {
            case "ArrowRight":
                if (oldDirection != "left" && oldDirection != "right") {
                        newDirection = "right";          
                } break;

            case "ArrowLeft":
                if (oldDirection != "right" && oldDirection != "left") {
                        newDirection = "left";                   
                } break;

            case "ArrowUp":
                if (oldDirection != "down" && oldDirection != "up") {
                        newDirection = "up";
                } break;


            case "ArrowDown":
                if (oldDirection != "down" && oldDirection != "up") {
                        newDirection = "down";
                } break;
        }
    });
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "a": addToBody(); break;
            case "A": addToBody();break;
            case "r": if (body.length>2){body.pop()} ;break;
            case "R": if (body.length>2){body.pop()} ;break;
        }
    });

    Easy.addEventListener("change", () => {
        if (Easy.checked) {v=5;}
      });
    Medium.addEventListener("change", () => {
        if (Medium.checked) {v=10;}
      });
      Hard.addEventListener("change", () => {
        if (Hard.checked) {v=15;}
      });
      





    // Run game
    window.requestAnimationFrame(gameLoop)
}


/****Main call*****/
main();

