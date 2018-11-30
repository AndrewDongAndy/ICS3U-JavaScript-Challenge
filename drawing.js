/*
A separate file for drawing (and potentially animation).
*/

const WIDTH = canvHangman.width;
const HEIGHT = canvHangman.height;

// Equivalent to the processing.js line().
function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// Equivalent to the processing.js ellipse(), radius mode.
function ellipse(x, y, radiusX, radiusY) {
    ctx.moveTo(x + radiusX, y);
    ctx.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.stroke();
}

function updateHook() {
    // base parameters
    let baseLeftX = WIDTH / 10;
    let baseRightX = WIDTH / 2;
    let topY = 10;
    let baseY = HEIGHT - 10;
    let personX = 3 / 5 * WIDTH;
    let hookLength = 25;
    let headRadius = 20;
    let bodyLength = 70;
    let wingSpan = 60;
    let eyeRadius = 3;

    // derived parameters
    let baseMidX = (baseLeftX + baseRightX) / 2;
    let hookTipY = topY + hookLength;
    let headCentreY = hookTipY + headRadius;
    let bodyTopY = headCentreY + headRadius;
    let bodyBottomY = bodyTopY + bodyLength;
    let armsY = 2 / 3 * bodyTopY + 1 / 3 * bodyBottomY;
    let leftArmX = personX - wingSpan / 2;
    let rightArmX = personX + wingSpan / 2;
    let feetY = bodyBottomY + 2 / 5 * bodyLength;
    let eyeDistance = headRadius / 2;
    let leftEyeX = personX - eyeDistance / 2;
    let rightEyeX = personX + eyeDistance / 2;
    let eyesY = headCentreY - headRadius / 5;
    let mouthY = headCentreY + headRadius / 3;

    switch (incorrect) {
        case 0:
            // draw empty hook
            line(baseLeftX, baseY, baseRightX, baseY); // base
            line(baseMidX, topY, baseMidX, baseY); // stand
            line(baseMidX, topY, personX, topY); // top
            line(personX, topY, personX, hookTipY); // hook down
            break;
        case 1:
            // draw head
            ellipse(personX, headCentreY, headRadius, headRadius); // head
            break;
        case 2:
            // draw body
            line(personX, bodyTopY, personX, bodyBottomY);
            break;
        case 3:
            // both arms (one straight line)
            line(leftArmX, armsY, rightArmX, armsY);
            break;
        case 4:
            // both legs
            line(leftArmX, feetY, personX, bodyBottomY);
            line(rightArmX, feetY, personX, bodyBottomY);
            break;
        case 5:
            // eyes
            ellipse(leftEyeX, eyesY, eyeRadius, eyeRadius);
            ellipse(rightEyeX, eyesY, eyeRadius, eyeRadius);
            break;
        case 6:
            // mouth (surprised!)
            ellipse(personX, mouthY, eyeDistance, eyeRadius);
        default:

    }
}
