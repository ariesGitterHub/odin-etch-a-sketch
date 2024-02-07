//*
// MAKE TOP LAYER FOR DRAWING AND BOTTOM LAYER FOR DUNGEON TILES

let blockNumTop = 5120; //64x80 at 15px for "drawing" top layer.
let blockNumBot = 1280; //32x40 at 30px for "dungeon tile" bottom layer.

// let blockNumTop = 20480; //124x160 at 7.5px for more detailed drawing layer. This slowed everything down too much. 

let divTop = "";
let divBot = "";

const innerContainerTop = document.querySelector("inner-container-top");
const innerContainerBot = document.querySelector("inner-container-bot");

function makeTopGrid() {
    for (let i = 0; i < blockNumTop; i++) {
    divTop = document.createElement("div");
    divTop.className = "divTopClass";
    innerContainerTop.appendChild(divTop);
    }    
}
makeTopGrid();

// TOGGLE TOP GRID TO HIDE IT AND WORK ON BOTTOM LAYER

const toggleHideTop = document.querySelector("#top-grid-hide");

document.addEventListener("change", hideTopGrid);

function hideTopGrid() {
  if(toggleHideTop.checked) {
    document.querySelectorAll(".divTopClass").forEach(function (div) {
        div.style.display = "none";
    })
    // console.log(`toggleHideTop is ${toggleHideTop.checked}`);
  } else {
    document.querySelectorAll(".divTopClass").forEach(function (div) {
      div.style.display = "flex";
    });
    // console.log(`toggleHideTop is ${toggleHideTop.checked}`);
  } 
}

hideTopGrid();

function makeBotGrid() {
  for (let i = 0; i < blockNumBot; i++) {
    let divBot = document.createElement("div");
    divBot.className = "divBotClass";
    innerContainerBot.appendChild(divBot);
  }
}
makeBotGrid();

//*
// COLOR PICKER AND PREVIEW BUTTON THAT IS CLICKABLE

const colorInput = document.querySelector("#colorInput");
const colorPreview = document.querySelector("#colorPreview");
const hexNameThatButton = document.querySelector("#colorPreview");

// UPDATES COLOR PREVIEW AFTER INPUT

colorInput.addEventListener("input", () => {
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

    btnColors.forEach(function (button) {
      button.addEventListener("click", function () {
        const buttonBgColor = window
          .getComputedStyle(button)
          .getPropertyValue("background-color");
        pickedColor = rgbToHex(buttonBgColor);
        // console.log(`AAAAA ${pickedColor}`); //DE-FINED HERE
        // console.log(
        //   `Button clicked! Background color is: ${rgbToHex(buttonBgColor)}.`);
        currentColorButton.style.backgroundColor =
          pickedColor;
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
        ("80");
      return hex.toUpperCase();
    }
  // console.log(`BBBBB ${pickedColor}`); //UNDEFINED HERE
});
  // console.log(`CCCCC ${pickedColor}`); //UNDEFINED HERE

//*
// TOGGLE BETWEEN "DRAW DETAIL" (ONE DIV PER CLICK) AND "DRAW SKETCH" (STREAM OF DIVS BEING COLORED)

// PRIOR HEADACHE: THE ISSUE WITH BOTH FUNCTIONS BEING ACTIVATED WHEN TOGGLED.CHECKED IS TRUE IS BECAUSE THE TWO FUNCTIONS CREATED MULTIPLE EVENT LISTENERS THAT HAD UNINTENDED EFFECTS...

let isDrawDetailOn = false;
let isDrawSketchOn = false;

function drawDetailOn(div) {
  div.addEventListener("click", handleDetail);
}
function handleDetail() {
  if (!toggleHideTop.checked && !isDrawSketchOn)
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
  if (isMouseBtnPressed && !toggleHideTop.checked && !isDrawDetailOn) {
    const target = event.target;
    if (target.classList.contains("divTopClass")) {
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
  const divs = document.querySelectorAll(".divTopClass");

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

const tileBtnNum = 150;

const innerTileBtnContainer = document.querySelector(
  "inner-tile-btn-container");

let tileBtn = "";

function tileBtnMaker() {
  for (let i = 0; i < tileBtnNum; i++) {
    tileBtn = document.createElement("button");
    tileBtn.className = "tile-btn";
    innerTileBtnContainer.appendChild(tileBtn);
  }
}

tileBtnMaker();

//*
// SELECT DUNGEON TILE VIA BUTTON TILE CLICK


// document.addEventListener("click", insertTile);

// let tileBtn = document.querySelectorAll(".tile-btn");

// let selectedTile;

// document.addEventListener("click", insertTile);

// function insertTile() {
//   if (toggleHideTop.checked) {
//     tileBtn.forEach(function () {
//       console.log("Tile btn clicked......");

//       })

//   }
// }


// insertTile();

//*
// INSERT DUNGEON TILE VIA MOUSE CLICK


//*
// MAKE DUNGEON TILES FLIPPABLE AND ROTATEABLE