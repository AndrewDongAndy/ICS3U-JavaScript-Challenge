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

// ----------END UTILITY FUNCTIONS----------


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
let eyeRadius = 2.5;

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
    // always fall through
    case 6:
      // mouth
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
      ellipse(x, headCentreY, headRadius, headRadius);
    default:

  }
}

// ----------END DRAWING----------


// ----------ANIMATION----------

// bounds between which the person is bounced
const LEFT_BOUND = 2 * headRadius;
const RIGHT_BOUND = WIDTH - LEFT_BOUND;

// bouncing speeds
const winMvtSpeed = 3;
const loseMvtSpeed = 1;

// to carry out animation
var curX;               // current location to display person
var animationY;         // y-coordinate to display ongoing animation
var deltaX;             // change in x for each animation frame
var cancelId = null;    // to cancel the ongoing animation

function startWinAnimation() {
  curX = LEFT_BOUND;
  animationY = 30;
  deltaX = winMvtSpeed;
  animatePerson();
}

function startLoseAnimation() {
  curX = LEFT_BOUND;
  animationY = HEIGHT - 5 / 2 * headRadius;
  deltaX = loseMvtSpeed;
  animatePerson();
}

function endAnimation() {
  if (cancelId == null) {
    return; // animation was not playing
  }
  cancelAnimationFrame(cancelId);
  cancelId = null;
}

// Bounces a person back and forth between the x-values
// LEFT_BOUND and RIGHT_BOUND at the given y-coordinate.
function animatePerson() {
  clearCanvas();
  drawPerson(curX, animationY, PERSON_STAGES);
  if (curX > RIGHT_BOUND || curX < LEFT_BOUND) {
    deltaX = -deltaX;
  }
  curX += deltaX;
  cancelId = requestAnimationFrame(animatePerson);
}

// ----------END ANIMATION----------
