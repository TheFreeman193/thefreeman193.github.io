let pi = Math.PI;
let pi2 = pi * 2;
let pisym = String.fromCharCode(960); // Pi symbol
let deg = String.fromCharCode(176); // Degrees symbol
let rad = String.fromCharCode(13229); // Radians symbol
let s2 = rnd9(Math.sqrt(2));
let s3 = rnd9(Math.sqrt(3));
let s22 = rnd9(s2 / 2);
let s32 = rnd9(s3 / 2);
let root = String.fromCharCode(8730);
let pi8 = Math.PI / 8;
let pi6 = Math.PI / 6;

function drawBackground(ct, w, h) {
    // Clear the graph
    ct.clearRect(0, 0, w, h);

    // Draw the grid
    ct.beginPath();
    ct.moveTo(w / 2, 0);
    ct.lineTo(w / 2, h);
    ct.moveTo(0, h / 2);
    ct.lineTo(w, h / 2);
    ct.stroke();

    // Draw the text
    ct.font = "16px Trebuchet MS";
    ct.fillStyle = "#AAA";
    ct.textAlign = "right";
    ct.fillText("0" + deg, w - 12, h / 2 - 6);

    ct.fillText("90" + deg, w / 2 - 5, 25);
    ct.textAlign = "left";
    ct.fillText(pisym + "/" + "2 " + rad, w / 2 + 5, 25);

    ct.fillText(pisym + " " + rad, 2, h / 2 - 7);
    ct.fillText("180" + deg, 2, h / 2 + 17);

    ct.fillText("270" + deg, w / 2 + 5, h - 15);
    ct.textAlign = "right";
    ct.fillText("3" + pisym + "/" + "2 " + rad, w / 2 - 5, h - 15);
}

function drawCircle(ct, w, h, ang) {
    let x = w / 2;
    let y = h / 2;
    let rad = w / 2.6;

    // Draw circle
    ct.beginPath(); // Draw first part in red
    ct.strokeStyle = "red";
    ct.arc(x, y, rad, 0, -ang);
    ct.lineTo(x, y);
    ct.stroke();
    ct.strokeStyle = "black";
    ct.beginPath(); // Finish circle
    ct.arc(x, y, rad, ang, pi2);
    ct.arc(x, y, rad + .5, 0, pi2);
    ct.arc(x, y, rad - .5, 0, pi2);
    ct.stroke();

    // Draw dot
    ct.beginPath();
    ct.arc(x, y, 2, 0, pi2);
    ct.fill();
}

function rnd9(v) {
    return (Math.round(v * 1e9) / 1e9);
}

function checkSurd(num) {
    let val = rnd9(num);
    switch (val) {
        case s2:
            return root + "2";
        case s3:
            return root + "3";
        case s22:
            return root + "2/2";
        case s32:
            return root + "3/2";
        case -s2:
            return "-" + root + "2";
        case -s3:
            return "-" + root + "3";
        case -s22:
            return "-" + root + "2/2";
        case -s32:
            return "-" + root + "3/2";
        default:
            return rnd9(num);
    }
}

function checkPi(num) {
    if (num == 0) return 0;
    else if (num == pi) return pisym;
    let out;
    let six = (num % pi6 == 0);
    if (num % pi8 == 0) out = 8 / Math.floor(num / pi8);
    else if (six) out = 6 / Math.floor(num / pi6);
    else return num;
    if (out < 1) return 1 / out + pisym;
    else return pisym + "/" + out;
}

function fillBoxes(ang, rev, deg, quad) {
    document.getElementById("outrev").value = rev;
    let nang = checkPi(deg ? ang / (pi / 180) : ang);
    nang = (typeof nang == "string" ? nang : checkSurd(nang));
    document.getElementById("outang").value = nang + String.fromCharCode(deg ? 176 : 13229);
    document.getElementById("outsin").value = checkSurd(Math.sin(ang));
    document.getElementById("outcos").value = checkSurd(Math.cos(ang));
    document.getElementById("outtan").value = (ang == pi / 2) ? 2e308 : checkSurd(Math.tan(ang));
    document.getElementById("outquad").value = quad;
}

function checkEnter(e) {
    if (e.keyCode == 13) doCalc();
}

function startup() {
    // After page has loaded
    let canvas = document.getElementById("outgraph");
    if (!canvas) return;
    let ct = canvas.getContext("2d");
    let w = canvas.width;
    let h = canvas.height;
    drawBackground(ct, w, h);
    drawCircle(ct, w, h, 0);
}

function typesel(id) {
    document.getElementById(id).checked = true;
}

function doCalc() {
    let ang = document.getElementById("ang").value || 0;
    if (isNaN(Number(ang.toString().replace(/[\*\+\-\/%pi\(\)\.]+/g, "")))) {
        alert("Enter a valid number!");
        return;
    }
    if (ang != "" && ang != "0") ang = ang.toString().replace("pi", "(" + pi + ")");
    ang = Math.abs(eval(ang));

    let deg = document.getElementById("seldeg").checked;
    if (deg) ang = ang * pi / 180;

    let revs = Math.floor(ang / (pi2));
    ang = ang % pi2;

    let quad;
    if (ang < pi / 2) quad = 1;
    else if (ang < pi) quad = 2;
    else if (ang < 3 * pi / 2) quad = 3;
    else quad = 4;

    let canvas = document.getElementById("outgraph");
    if (!canvas) return;

    let ct = canvas.getContext("2d");
    let w = canvas.width;
    let h = canvas.height;

    drawBackground(ct, w, h);
    drawCircle(ct, w, h, ang);
    fillBoxes(ang, revs, deg, quad);
}
