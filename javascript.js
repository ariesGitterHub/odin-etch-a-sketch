const me = "Copyright © Mad Muffin Man Design Studio 2024";
const addMe = document.querySelector("me");
addMe.textContent = me;

//*
// MAKE PAINT LAYER FOR DRAWING AND TILE LAYER FOR DUNGEON TILES

let blockNumPaint = 5120; //64x80 at 15px for "drawing" paint layer.
let blockNumTile = 1280; //32x40 at 30px for "dungeon tile" layer.
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
    console.log(`toggleHidePaint is ${toggleHidePaint.checked}`);
  } else {
    document.querySelectorAll(".divPaintClass").forEach(function (div) {
      div.style.display = "block";
    });
    console.log(`toggleHidePaint is ${toggleHidePaint.checked}`);
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

//*
// COLOR PICKER AND PREVIEW BUTTON THAT IS CLICKABLE

const colorInput = document.querySelector("#color-input");
const colorPreview = document.querySelector(".color-preview");
const hexNameThatButton = document.querySelector(".color-preview");

// UPDATES COLOR PREVIEW AFTER INPUT

colorInput.addEventListener("input", function () {
  const selectedColor = `${colorInput.value}80`;
  // console.log(selectedColor);
  colorPreview.style.backgroundColor = selectedColor;
  hexNameThatButton.style.fontSize = "18px";
  hexNameThatButton.textContent = selectedColor;
  // console.log(hexNameThatButton.textContent);

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
  // console.log(rgbColor);

  // DYNAMICALLY CHANGES TEXT COLOR AGAINST BACKGROUND COLOR FOR CONTRAST

  function setContrastColor() {
    const { r, g, b } = rgbColor;
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    let contrastColor;

    if (yiq >= 128) {
      contrastColor = "#000";
      hexNameThatButton.style.color = contrastColor;
    } else {
      contrastColor = "#fff";
      hexNameThatButton.style.color = contrastColor;
    }
  }
  setContrastColor();
});

//*
// GET CSS COLOR OF THE COLOR SELECTOR BUTTONS


let pickedColor;
const currentColorButton = document.querySelector("#current-color");

document.addEventListener("DOMContentLoaded", function () {
  const btnColors = document.querySelectorAll(".color-value");
  // const noColor = document.querySelector("#no-color");
 
  btnColors.forEach(function (button) {
    button.addEventListener("click", function () {
      
      const buttonBgColor = window
        .getComputedStyle(button)
        .getPropertyValue("background-color");
      pickedColor = rgbToHex(buttonBgColor);
      // console.log(`This color ${pickedColor} is defined here.`); //DE-FINED HERE
      // console.log(
      //   `Button clicked! Background color is: ${rgbToHex(buttonBgColor)}.`);

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
      // ("0" + parseInt(rgbArray[2], 10).toString(16)).slice(-2); // C'ED OUT B/C I ADDED CODE LINE BELOW TO FORCE 80 AN END OF HEX (ADDING 80 MEANS 1/2 OPACITY)

      ("0" + parseInt(rgbArray[2], 10).toString(16)).slice(-2) +
      "80";
      
    return hex.toUpperCase();
  }
  // console.log(`I should not see ${pickedColor} here, part 1.`); //UNDEFINED HERE
});
  // console.log(`I should not see ${pickedColor} here, part 2.`); //UNDEFINED HERE

//*
// TOGGLE BETWEEN "DRAW DETAIL" (ONE DIV PER CLICK) AND "DRAW SKETCH" (i.e., STREAM OF DIVS BEING COLORED)

// PRIOR HEADACHE: THE ISSUE WITH BOTH FUNCTIONS BEING ACTIVATED WHEN TOGGLED.CHECKED IS TRUE IS BECAUSE THE TWO FUNCTIONS CREATED MULTIPLE EVENT LISTENERS THAT HAD UNINTENDED EFFECTS...

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

// FINALLY GOT THIS TO WORK BETTER NOW B/C I ADDED ADDITIONAL BOOLEAN GATE ON BOTH DETAIL AND SKETCH FUNCTIONS, i.e., !isDrawDetailOn and !isDrawSketchOn... ONE ISSUE: IN STREAM MODE CLICKS STILL GET STUCK CAUSING TWO STREAM CASES. THIS MIGHT BE CAUSE BY MEATSPACE MOUSE CLICK BUTTON.

let isMouseBtnPressed = false;

function drawSketchOn(div) {
  div.addEventListener("mousedown", function () {
    isMouseBtnPressed = true;
    // console.log(`isMouseBtnPressed = ${isMouseBtnPressed}`);
  });
}

function drawSketchTempOff() {
  document.addEventListener("mouseup", function () {
    isMouseBtnPressed = false;
    // console.log(`isMouseBtnPressed = ${isMouseBtnPressed}`);
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
  .querySelector("#etch-style-switch")
  .addEventListener("change", etchStyleSwitch);

const toggleEtch = document.querySelector("#etch-style-switch");

function etchStyleSwitch() {
  const divs = document.querySelectorAll(".divPaintClass");

  if (toggleEtch.checked) {
    // console.log(`Toggled etch style position is ${toggleEtch.checked}`);
    isDrawSketchOn = true;
    isDrawDetailOn = false;

    divs.forEach(drawSketchOn);
    divs.forEach(drawDetailOff);
  } else {
    // console.log(`Toggled etch style position is ${toggleEtch.checked}`);
    isDrawDetailOn = true;
    isDrawSketchOn = false;

    divs.forEach(drawDetailOn);
    divs.forEach(drawSketchOff);
  }
}

etchStyleSwitch();

//*
// CREATE 150 DUNGEON TILE BUTTONS DYNAMICALLY AND ADD UNIQUE DUNGEON TILE SVG

async function fetchData() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    return data; // Returns the data here...
  } catch (error) {
    console.error("Error fetching data:", error);
   }
}

const innerTileBtnContainer = document.querySelector(
  "inner-tile-btn-container");

async function processData() {
  try {
    const dungeonTiles = await fetchData();
    tileBtnMaker(dungeonTiles) //THIS IS VITAL HERE...
    // console.log(dungeonTiles);
    // console.log(dungeonTiles.length);
  } catch (error) {
    console.error("Error processing data:", error);
  }
}

// let pickedTile = ""

const btnTileClicked = document.querySelectorAll(".tile-btn");

function tileBtnMaker(dungeonTiles) {
  dungeonTiles.forEach(function (button) {
    const tileBtn = document.createElement("button");
    tileBtn.className = "tile-btn";
    // tileBtn.classList.add("tile-btn");
    tileBtn.id = `tileBtn${button.id}`;
    tileBtn.innerHTML = `<img src="${button.svgPath}" alt="Dungeon tile button ${button.id}">`;
    innerTileBtnContainer.appendChild(tileBtn);
    // console.log(tileBtn.className);
    // PUT...HERE...// SELECT DUNGEON TILE VIA BUTTON TILE CLICK
    tileBtn.addEventListener("click", function () {
     pickTile(button) 
    });
  });
}

//*
// SELECT DUNGEON TILE VIA BUTTON TILE CLICK
function pickTile(button) {
  console.log("test2");
  let pickedTile = document.querySelector(".tile-selector-btn");
  pickedTile.innerHTML = `<img src="${button.svgPath}">`;
  // console.log(pickedTile.innerHTML); //defined

  let currentPickedTile = pickedTile.querySelector("img"); //THIS WAS WHAT I WAS MISSING!!!!!! Otherwise, currentPickedTile is a string containing the HTML content, not a reference to a DOM element.

  console.log(`currentPickedTile = ${currentPickedTile}`); //defined
  if (currentPickedTile) {
    alterTile(currentPickedTile); // Call alterTile directly
  } else {
    console.error("Image element not found in pickedTile");
  }

}


function alterTile(currentPickedTile) {
  //!!!BELOW...defensive programming measure to check if currentPickedTile (i.e., picked img element) is undefined before attempting to access its properties. This check ensures that the code inside the alterTile function won't proceed to manipulate the style property of currentPickedTile if currentPickedTile is not a valid DOM element.

  if (!currentPickedTile) {
    console.error("SVG element is undefined");
    return;
  }

  console.log(currentPickedTile);

  console.log("Meatball");
  console.log(`alterTile 1 Log ${currentPickedTile}`); //NOW LOGGING...

  let currentRotation = 0;
  let flipX = 1;
  let flipY = 1;

  const tileCtrlBtn = document.querySelectorAll(".tile-ctrl-btn");
  tileCtrlBtn.forEach(function (button) {
    button.addEventListener("click", function () {

      if (button.classList.contains("rotate-clock")) {
        console.log("test for rotate-clock");
        console.log(`clock = ${currentPickedTile}`);
        currentRotation += 90;
        applyTransform();

      } else if (button.classList.contains("rotate-anti")) {
        console.log("test for rotate-anti");
        console.log(`anti = ${currentPickedTile}`);
        currentRotation -= 90;
        applyTransform();

      } else if (button.classList.contains("flip-l-r")) {
        console.log("test for flip-l-r");
        console.log(`flip-LR = ${currentPickedTile}`);
        flipX *= -1;
        applyTransform();

      } else if (button.classList.contains("flip-u-d")) {
        console.log("test for flip-u-d");
        console.log(`flip-UD = ${currentPickedTile}`);
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
        console.log(`This is the insertable Tile ${insertCurrentPickedTile}`);
      } else {
        console.error("Image element not found in currentPickedTile");
      }
}

alterTile()



//*
// MAKE DUNGEON TILES FLIP-ABLE AND ROTATABLE

// function alterPickedTile() {
//   console.log("test3")
// }

      // const rotateClock = document.querySelector(".rotate-clock");
      // const rotateAnti = document.querySelector(".rotate-anti");
      // const flipLR = document.querySelector(".flip-l-r");
      // const flipUD = document.querySelector(".flip-u-d");


  // if (toggleHidePaint.checked) {
  //   document.querySelectorAll(".divPaintClass").forEach(function (div) {
  //     div.style.display = "none";
  //   });
//*
// INSERT DUNGEON TILE VIA MOUSE CLICK
function insertTile(insertCurrentPickedTile) {

    console.log(`INSERTABLE FINAL SVG = ${insertCurrentPickedTile}`); //DEFINED!!!
  
  if (toggleHidePaint.checked) {
    document.querySelectorAll(".divTileClass").forEach(function (div) {
      div.addEventListener("click", function () {
        let insertThisTile = insertCurrentPickedTile.outerHTML;
        div.innerHTML = insertThisTile;
      });
    });
  } else {
    console.log("Something went sideways...");
  }
}

insertTile()

const modalOpenBtn = document.querySelector("#modal-open-btn")
modalOpenBtn.addEventListener("click", openModal)


function openModal() {
const customModal = document.querySelector("custom-modal");
customModal.style.display = "block";

const modalDirections = document.querySelector("#modal-directions");

const modalCloseBtn = document.querySelector("#modal-close-btn");
modalCloseBtn.addEventListener("click", closeModal);

function closeModal() {
  customModal.style.display = "none";
}
}

const resetAllBtn = document.querySelector("#reset-all-btn");
  resetAllBtn.addEventListener("click", resetAll)

function resetAll() {
  location.reload();
  return false;
}


processData();
