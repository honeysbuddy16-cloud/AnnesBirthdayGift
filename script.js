// ======================================================
// GLOBAL VARIABLES
// ======================================================

// ---------- Pages ----------
const welcomePage = document.getElementById("welcomePage");
const drawingPage = document.getElementById("drawingPage");
const bouquetPage = document.getElementById("bouquetPage");

// ---------- Buttons ----------
const continueButton = document.getElementById("continueButton");
const nextButton = document.getElementById("nextButton");
const downloadBouquet = document.getElementById("downloadBouquet");

// ---------- Bouquet Titles ----------
const birthdayTitle = document.getElementById("birthdayTitle");
const bouquetTitle = document.getElementById("bouquetTitle");

// ---------- Bouquet Canvas ----------
const bouquetCanvas = document.getElementById("bouquetCanvas");
const bouquetCtx = bouquetCanvas.getContext("2d");

// ---------- Export Canvas ----------
const exportCanvas = document.createElement("canvas");
const exportCtx = exportCanvas.getContext("2d");

// ---------- Images ----------
let flowerImage = new Image();

const bouquetBase = new Image();
bouquetBase.src = "images/bouquet.png";

bouquetBase.onload = function () {
    drawBouquet();
};

const flowerCanvas = document.getElementById("flowerCanvas");
const flowerCtx = flowerCanvas.getContext("2d");


const cardPage = document.getElementById("cardPage");
const cardButton = document.getElementById("cardButton");


const cardFront =
    document.getElementById("cardFront");





cardButton.addEventListener("click", function () {

    bouquetPage.style.opacity = "0";

    setTimeout(function () {

        bouquetPage.style.display = "none";

        cardPage.style.display = "flex";

        cardPage.offsetHeight;

        cardPage.style.opacity = "1";

    }, 800);

});
cardFront.addEventListener("click", function(){

    cardFront.style.transform =
        "rotateY(-170deg)";

});



// ======================================================
// WELCOME PAGE
// ======================================================

continueButton.addEventListener("click", function () {

    welcomePage.style.opacity = "0";

    setTimeout(function () {

        welcomePage.style.display = "none";

        drawingPage.style.display = "flex";

        drawingPage.offsetHeight;

        drawingPage.style.opacity = "1";

    }, 800);

});

// ======================================================
// DRAWING PAGE → BOUQUET PAGE
// ======================================================

nextButton.addEventListener("click", function () {

    // Save user's drawing
    flowerImage = new Image();
    flowerImage.src = canvas.toDataURL("image/png");

    drawingPage.style.opacity = "0";

    setTimeout(function () {

        drawingPage.style.display = "none";

        bouquetPage.style.display = "flex";

        bouquetPage.offsetHeight;

        bouquetPage.style.opacity = "1";

        drawBouquet();

        flowerCtx.clearRect(
    0,
    0,
    flowerCanvas.width,
    flowerCanvas.height
);

flowerCtx.drawImage(
    canvas,
    0,
    0
);

        startBouquetAnimation();

    }, 800);

});

// ======================================================
// DRAW BOUQUET
// ======================================================

function drawBouquet() {

    bouquetCtx.clearRect(
        0,
        0,
        bouquetCanvas.width,
        bouquetCanvas.height
    );

    bouquetCtx.drawImage(
        bouquetBase,
        0,
        0,
        bouquetCanvas.width,
        bouquetCanvas.height
    );

    if (!flowerImage.src) return;

    bouquetCtx.drawImage(

        flowerImage,

        135,     // X
        40,     // Y

        170,    // Width
        310     // Height

    );

}

// ======================================================
// BOUQUET TITLE ANIMATION
// ======================================================

let bouquetAnimationStarted = false;

function startBouquetAnimation() {

    if (bouquetAnimationStarted) return;

    bouquetAnimationStarted = true;

    birthdayTitle.style.display = "block";
    bouquetTitle.style.display = "block";

    birthdayTitle.style.opacity = "1";
    bouquetTitle.style.opacity = "0";

    shootConfetti();

    setTimeout(startTitleLoop, 900);

}

function startTitleLoop() {

    setInterval(function () {

        if (birthdayTitle.style.opacity === "1") {

            birthdayTitle.style.opacity = "0";
            bouquetTitle.style.opacity = "1";

        }

        else {

            birthdayTitle.style.opacity = "1";
            bouquetTitle.style.opacity = "0";

            shootConfetti();

        }

    }, 3500);

}

// ======================================================
// CONFETTI
// ======================================================

function shootConfetti() {

    confetti({

        particleCount: 100,
        angle: 80,
        spread: 100,

        origin: {
            x: 0,
            y: 0.6
        }

    });

    confetti({

        particleCount: 100,
        angle: 100,
        spread: 100,

        origin: {
            x: 1,
            y: 0.6
        }

    });

}

// ======================================================
// DRAWING PAD
// ======================================================

const canvas = document.getElementById("drawingPad");
const ctx = canvas.getContext("2d");

let drawing = false;
let tool = "pen";
let brushSize = 3;

let history = [];
let redoHistory = [];


// ------------------------------------------------------
// Initialize
// ------------------------------------------------------

window.onload = function () {

    saveState();

};


// ------------------------------------------------------
// Controls
// ------------------------------------------------------

const penButton = document.getElementById("penButton");
const eraserButton = document.getElementById("eraserButton");
const undoButton = document.getElementById("undoButton");
const redoButton = document.getElementById("redoButton");
const sizeSlider = document.getElementById("brushSize");

penButton.addEventListener("click", function () {

    tool = "pen";

});

eraserButton.addEventListener("click", function () {

    tool = "eraser";

});

undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);

sizeSlider.addEventListener("input", function () {

    brushSize = Number(sizeSlider.value);

});


// ------------------------------------------------------
// Mouse Events
// ------------------------------------------------------

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);


// ------------------------------------------------------
// Drawing
// ------------------------------------------------------

function startDrawing(event) {

    drawing = true;

    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);

}

function draw(event) {

    if (!drawing) return;

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "pen") {

        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = "black";

    }

    else {

        ctx.globalCompositeOperation = "destination-out";

    }

    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);

}

function stopDrawing() {

    if (!drawing) return;

    drawing = false;

    ctx.beginPath();

    saveState();

    checkCanvas();

}


// ------------------------------------------------------
// Undo / Redo
// ------------------------------------------------------

function saveState() {

    history.push(canvas.toDataURL());

    redoHistory = [];

    if (history.length > 50) {

        history.shift();

    }

}

function undo() {

    if (history.length <= 1) return;

    redoHistory.push(history.pop());

    restoreState(history[history.length - 1]);

}

function redo() {

    if (redoHistory.length === 0) return;

    const state = redoHistory.pop();

    history.push(state);

    restoreState(state);

}

function restoreState(state) {

    const img = new Image();

    img.src = state;

    img.onload = function () {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.drawImage(img, 0, 0);

        checkCanvas();

    };

}


// ------------------------------------------------------
// Show / Hide Next Button
// ------------------------------------------------------

function checkCanvas() {

    const pixels = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    ).data;

    let hasInk = false;

    for (let i = 3; i < pixels.length; i += 4) {

        if (pixels[i] !== 0) {

            hasInk = true;
            break;

        }

    }

    nextButton.style.display = hasInk ? "block" : "none";

}


// ======================================================
// DOWNLOAD BOUQUET
// ======================================================

exportCanvas.width = 3072
exportCanvas.height = 3072

downloadBouquet.addEventListener("click", function () {

    exportCtx.clearRect(
        0,
        0,
        exportCanvas.width,
        exportCanvas.height
    );

    // Draw bouquet PNG
    exportCtx.drawImage(
        bouquetBase,
        0,
        0,
        exportCanvas.width,
        exportCanvas.height
    );

    // Draw user's flower
    if (flowerImage.src) {

        exportCtx.drawImage(

            flowerImage,

            68,
            40,

            330,
            310

        );

    }

    const link = document.createElement("a");

    link.download = "Family Bouquet.png";
    link.href = exportCanvas.toDataURL("image/png");

    link.click();

});
