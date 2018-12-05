/*
A separate file for drawing and animation.
*/

const PERSON_STAGES = 6;
const WIDTH = canvHangman.width;
const HEIGHT = canvHangman.height;

var ctx = canvHangman.getContext('2d');

// ----------UTILITY FUNCTIONS----------

// Equivalent to the processing.js line().
function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// Equivalent to the processing.js ellipse(), radius mode.
function ellipse(x, y, radiusX, radiusY) {
    ctx.beginPath();
    ctx.moveTo(x + radiusX, y);
    ctx.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.stroke();
}


// ----------DRAWING----------

// base parameters
let baseLeftX = WIDTH / 10;
let baseRightX = WIDTH / 2;
let topY = 10;
let baseY = HEIGHT - 10;
let hookLength = 25;

// derived parameters
let baseMidX = (baseLeftX + baseRightX) / 2;
let hookTipY = topY + hookLength;

// person parameters
let personX = 3 / 5 * WIDTH;
let headRadius = 20;
let bodyLength = 70;
let wingSpan = 60;
let eyeRadius = 3;

// animation parameters
let winSpeed = 3;
let loseSpeed = 1;

function updateHook(incorrect) {
    resetHook();
    drawPerson(personX, hookTipY, incorrect);
}

function clearCanvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// Draws an empty hook in the canv-hangman canvas.
function resetHook() {
    clearCanvas();
    line(baseLeftX, baseY, baseRightX, baseY); // base
    line(baseMidX, topY, baseMidX, baseY); // stand
    line(baseMidX, topY, personX, topY); // top
    line(personX, topY, personX, hookTipY); // hook down
}

// Given the location of the top of the head, draw a person.
function drawPerson(x, y, stage) {
    let headCentreY = y + headRadius;
    let bodyTopY = headCentreY + headRadius;
    let bodyBottomY = bodyTopY + bodyLength;
    let armsY = 2 / 3 * bodyTopY + 1 / 3 * bodyBottomY;
    let leftArmX = x - wingSpan / 2;
    let rightArmX = x + wingSpan / 2;
    let feetY = bodyBottomY + 2 / 5 * bodyLength;
    let eyeDistance = headRadius / 2;
    let leftEyeX = x - eyeDistance / 2;
    let rightEyeX = x + eyeDistance / 2;
    let eyesY = headCentreY - headRadius / 5;
    let mouthY = headCentreY + headRadius / 3;

    switch (stage) {
        case 6:
            // mouth (surprised!)
            ellipse(x, mouthY, eyeDistance, eyeRadius);
        case 5:
            // eyes
            ellipse(leftEyeX, eyesY, eyeRadius, eyeRadius);
            ellipse(rightEyeX, eyesY, eyeRadius, eyeRadius);
        case 4:
            // both legs
            line(leftArmX, feetY, x, bodyBottomY);
            line(rightArmX, feetY, x, bodyBottomY);
        case 3:
            // both arms (one straight line)
            line(leftArmX, armsY, rightArmX, armsY);
        case 2:
            // body
            line(x, bodyTopY, x, bodyBottomY);
        case 1:
            // head
            ellipse(x, headCentreY, headRadius, headRadius); // head
    }
}

const LEFT_BOUND = 20;
const RIGHT_BOUND = WIDTH - LEFT_BOUND;
var curX;
var animationY;
var delta;
var cancelId = null;

function startWinAnimation() {
    curX = LEFT_BOUND;
    animationY = 30;
    delta = winSpeed;
    animateWin();
}

function endWinAnimation() {
    if (cancelId == null) return;
    cancelAnimationFrame(cancelId);
    cancelId = null;
}

function animateWin() {
    clearCanvas();
    drawPerson(curX, animationY, PERSON_STAGES);
    if (curX > RIGHT_BOUND || curX < LEFT_BOUND) delta = -delta;
    curX += delta;
    cancelId = requestAnimationFrame(animateWin);
}

function startLoseAnimation() {
    curX = LEFT_BOUND;
    animationY = HEIGHT - 5 / 2 * headRadius;
    delta = loseSpeed;
    animateWin();
}
