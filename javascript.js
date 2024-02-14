const me = "Copyright © Mad Muffin Man Design Studio 2024";
const addMe = document.querySelector("me");
addMe.textContent = me;

// MAKE PAINT LAYER FOR DRAWING AND TILE LAYER FOR DUNGEON TILES

let blockNumPaint = 5120; // 64x80 at 15px for "drawing" paint layer.
let blockNumTile = 1280; // 32x40 at 30px for "dungeon tile" layer.
// let blockNumPaint = 20480; //124x160 at 7.5px for more detailed drawing layer. This slowed everything down too much.

let divPaint = "";
let divTile = "";

const innerContainerPaint = document.querySelector("inner-container-paint");
const innerContainerTile = document.querySelector("inner-container-tile");

function makePaintGrid() {
  for (let i = 0; i < blockNumPaint; i++) {
    divPaint = document.createElement("div");
    divPaint.className = "divPaintClass";
    innerContainerPaint.appendChild(divPaint);
  }
}
makePaintGrid();

// TOGGLE PAINT GRID TO HIDE IT AND WORK ON TILE LAYER

const toggleHidePaint = document.querySelector("#paint-grid-hide");

document.addEventListener("change", hidePaintGrid);

function hidePaintGrid() {
  if (toggleHidePaint.checked) {
    document.querySelectorAll(".divPaintClass").forEach(function (div) {
      div.style.display = "none";
    });
  } 
  else {
    document.querySelectorAll(".divPaintClass").forEach(function (div) {
      div.style.display = "block";
    });
  }
}

hidePaintGrid();

function makeTileGrid() {
  for (let i = 0; i < blockNumTile; i++) {
    let divTile = document.createElement("div");
    divTile.className = "divTileClass";
    innerContainerTile.appendChild(divTile);
  }
}
makeTileGrid();

// COLOR PICKER AND PREVIEW BUTTON THAT IS CLICKABLE

const colorInput = document.querySelector("#color-input");
const colorPreview = document.querySelector(".color-preview");
const hexNameThatButton = document.querySelector(".color-preview");

// UPDATES COLOR PREVIEW AFTER INPUT

colorInput.addEventListener("input", function () {
  const selectedColor = `${colorInput.value}80`;
  colorPreview.style.backgroundColor = selectedColor;
  hexNameThatButton.style.fontSize = "18px";
  hexNameThatButton.textContent = selectedColor;

// HEX TO RGB HELPER

  function hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return { r, g, b };
  }

  let hexColor = selectedColor;
  let rgbColor = hexToRgb(hexColor);

// DYNAMICALLY CHANGES TEXT COLOR AGAINST BACKGROUND COLOR FOR CONTRAST

  function setContrastColor() {
    const { r, g, b } = rgbColor;
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    let contrastColor;

    if (yiq >= 128) {
      contrastColor = "#000";
      hexNameThatButton.style.color = contrastColor;
    } 
    else {
      contrastColor = "#fff";
      hexNameThatButton.style.color = contrastColor;
    }
  }
  setContrastColor();
});

// GET CSS COLOR OF THE COLOR SELECTOR BUTTONS

let pickedColor;
const currentColorButton = document.querySelector("#current-color");

document.addEventListener("DOMContentLoaded", function () {
  const btnColors = document.querySelectorAll(".color-value");
 
  btnColors.forEach(function (button) {
    button.addEventListener("click", function () {
      
      const buttonBgColor = window
        .getComputedStyle(button)
        .getPropertyValue("background-color");
      pickedColor = rgbToHex(buttonBgColor);
      // console.log(`This color ${pickedColor} is defined here.`);
      // console.log(`Button clicked! Background color is: ${rgbToHex(buttonBgColor)}.`);
      currentColorButton.style.backgroundColor = pickedColor;
      currentColorButton.textContent = pickedColor;
    });
  });

// RGB TO HEX

  function rgbToHex(rgb) {
    const rgbArray = rgb.match(/\d+/g);
    const hex =
      "#" +
      ("0" + parseInt(rgbArray[0], 10).toString(16)).slice(-2) +
      ("0" + parseInt(rgbArray[1], 10).toString(16)).slice(-2) +
      // ("0" + parseInt(rgbArray[2], 10).toString(16)).slice(-2); // COMMENTED OUT B/C I ADDED CODE LINE BELOW TO FORCE 80 AN END OF HEX (ADDING 80 MEANS 1/2 OPACITY). LEAVE IN, IN CASE I CHANGE MY MIND.

      ("0" + parseInt(rgbArray[2], 10).toString(16)).slice(-2) +
      "80";
      
    return hex.toUpperCase();
  }
});

// TOGGLE BETWEEN "DRAW DETAIL" (ONE DIV PER CLICK) AND "DRAW SKETCH" (i.e., STREAM OF DIVS BEING COLORED)

// PRIOR HEADACHE: THE ISSUE WITH BOTH FUNCTIONS BEING ACTIVATED WHEN "TOGGLED.CHECKED" IS TRUE IS BECAUSE THE TWO FUNCTIONS CREATED MULTIPLE EVENT LISTENERS THAT HAD UNINTENDED EFFECTS.

let isDrawDetailOn = false;
let isDrawSketchOn = false;

function drawDetailOn(div) {
  div.addEventListener("click", handleDetail);
}
function handleDetail() {
  if (!toggleHidePaint.checked && !isDrawSketchOn)
    this.style.backgroundColor = pickedColor;
}
function drawDetailOff(div) {
  div.removeEventListener("click", handleDetail);
}

// FINALLY GOT THIS TO WORK BETTER NOW B/C I ADDED ADDITIONAL BOOLEAN GATE ON BOTH DETAIL AND SKETCH FUNCTIONS, I.E., !isDrawDetailOn and !isDrawSketchOn. ONE ISSUE: IN STREAM MODE CLICKS STILL GET STUCK CAUSING TWO STREAM CASES. THIS MIGHT BE CAUSE BY MEAT-SPACE MOUSE CLICK BUTTON.

let isMouseBtnPressed = false;

function drawSketchOn(div) {
  div.addEventListener("mousedown", function () {
    isMouseBtnPressed = true;
  });
}

function drawSketchTempOff() {
  document.addEventListener("mouseup", function () {
    isMouseBtnPressed = false;
  });
}

drawSketchTempOff();

document.addEventListener("mousemove", function (event) {
  if (isMouseBtnPressed && !toggleHidePaint.checked && !isDrawDetailOn) {
    const target = event.target;
    if (target.classList.contains("divPaintClass")) {
      target.style.backgroundColor = pickedColor;
    }
  }
});

function drawSketchOff(div) {
  div.removeEventListener("mousedown", drawSketchOn);
}

document
  .querySelector("#paint-style-switch")
  .addEventListener("change", paintStyleSwitch);

const togglePaintStyle = document.querySelector("#paint-style-switch");

function paintStyleSwitch() {
  const divs = document.querySelectorAll(".divPaintClass");

  if (togglePaintStyle.checked) {
    isDrawSketchOn = true;
    isDrawDetailOn = false;

    divs.forEach(drawSketchOn);
    divs.forEach(drawDetailOff);
  } 
  else {
    isDrawDetailOn = true;
    isDrawSketchOn = false;

    divs.forEach(drawDetailOn);
    divs.forEach(drawSketchOff);
  }
}

paintStyleSwitch();

// CREATE 150 DUNGEON TILE BUTTONS DYNAMICALLY AND ADD UNIQUE DUNGEON TILE SVGS

async function fetchData() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    return data;
  } 
  catch (error) {
    console.error("Error fetching data:", error);
   }
}

const innerTileBtnContainer = document.querySelector(
  "inner-tile-btn-container");

async function processData() {
  try {
    const dungeonTiles = await fetchData();
    tileBtnMaker(dungeonTiles) //THIS IS VITAL HERE...REMINDER.
  } 
  catch (error) {
    console.error("Error processing data:", error);
  }
}

const btnTileClicked = document.querySelectorAll(".tile-btn");

function tileBtnMaker(dungeonTiles) {
  dungeonTiles.forEach(function (button) {
    const tileBtn = document.createElement("button");
    tileBtn.className = "tile-btn";
    tileBtn.id = `tileBtn${button.id}`;
    tileBtn.innerHTML = `<img src="${button.svgPath}" alt="Dungeon tile button ${button.id}">`;
    innerTileBtnContainer.appendChild(tileBtn);
    tileBtn.addEventListener("click", function () {
    pickTile(button) 
    });
  });
}

// SELECT DUNGEON TILE VIA BUTTON TILE CLICK

function pickTile(button) {
  let pickedTile = document.querySelector(".tile-selector-btn");
  pickedTile.innerHTML = `<img src="${button.svgPath}">`;
  let currentPickedTile = pickedTile.querySelector("img"); //THIS WAS WHAT I WAS MISSING!!! Otherwise, currentPickedTile is a string containing the HTML content, not a true DOM element.
  if (currentPickedTile) {
    alterTile(currentPickedTile); // Call alterTile directly
  } 
  else {
    console.error("Image element not found in pickedTile.");
  }
}

// MAKE DUNGEON TILES FLIP-ABLE AND ROTATABLE

function alterTile(currentPickedTile) {
  //BELOW...defensive programming measure to check if currentPickedTile (i.e., picked img element) is undefined before attempting to access its properties. This check ensures that the code inside the alterTile function won't proceed to manipulate the style property of currentPickedTile if currentPickedTile is not a valid DOM element.
  if (!currentPickedTile) {
    return;
  }

  let currentRotation = 0;
  let flipX = 1;
  let flipY = 1;

  const tileCtrlBtn = document.querySelectorAll(".tile-ctrl-btn");
  tileCtrlBtn.forEach(function (button) {
    button.addEventListener("click", function () {

      if (button.classList.contains("rotate-clock")) {
        currentRotation += 90;
        applyTransform();

      } else if (button.classList.contains("rotate-anti")) {
        currentRotation -= 90;
        applyTransform();

      } else if (button.classList.contains("flip-l-r")) {
        flipX *= -1;
        applyTransform();

      } else if (button.classList.contains("flip-u-d")) {
        flipY *= -1;
        applyTransform();

      }
    });
  });

//NEEDED HELP WITH THIS ONE...as there was no continuity between the various button clicks, a button rotation click followed by a button horizontal flip rests the img.

  function applyTransform() {
    currentPickedTile.style.transform = `rotate(${currentRotation}deg) scaleX(${flipX}) scaleY(${flipY})`;
  }
    let insertCurrentPickedTile = currentPickedTile; 
      if (insertCurrentPickedTile) {
        insertTile(insertCurrentPickedTile);
      } 
      else {
        console.error("Image element not found in currentPickedTile");
      }
}

alterTile()

// INSERT DUNGEON TILE VIA MOUSE CLICK

function insertTile(insertCurrentPickedTile) {
  if (toggleHidePaint.checked) {
    document.querySelectorAll(".divTileClass").forEach(function (div) {
      div.addEventListener("click", function () {
        let insertThisTile = insertCurrentPickedTile.outerHTML;
        div.innerHTML = insertThisTile;
      });
    });
  } else {
    console.log("Toggle not set to dungeon tile mode.");
  }
}

insertTile()
processData();

const modalOpenBtn = document.querySelector("#modal-open-btn")
modalOpenBtn.addEventListener("click", openModal)

// CUSTOM MODAL WILL DISPLAY DIRECTIONS

function openModal() {
const customModal = document.querySelector("custom-modal");
customModal.style.display = "block";

const modalCloseBtn = document.querySelector("#modal-close-btn");
modalCloseBtn.addEventListener("click", closeModal);

function closeModal() {
  customModal.style.display = "none";
}
}

const resetAllBtn = document.querySelector("#reset-all-btn");
  resetAllBtn.addEventListener("click", resetAll)

//RESET ALL BUTTON RELOADS PAGE AND CLEARS ALL INPUTS

function resetAll() {
  location.reload();
  return false;
}