// let blockNumTop = 20480; //124x160 at 7.5px TOO SLOW!!!

let blockNumTop = 5120; //64x80 at 15px
let blockNumBot = 1280; //32x40 at 30px

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

const toggleHideTop = document.querySelector("#top-grid-hide");

document.addEventListener("change", hideTopGrid);

function hideTopGrid() {
  if(toggleHideTop.checked) {
    document.querySelectorAll(".divTopClass").forEach(function (div) {
      // div.style.visibility = "hidden";
        div.style.display = "none";
    })
    console.log(`toggleHideTop is ${toggleHideTop.checked}`);

  } else {
    document.querySelectorAll(".divTopClass").forEach(function (div) {
      // div.style.visibility = "visible";
      div.style.display = "flex";
    });
    console.log(`toggleHideTop is ${toggleHideTop.checked}`);
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

// MY ORIGINAL METHOD OF CREATING THE GRID
// for (let i = 0; i < blockNumBot; i++) {
//   divBot += `<div>${i + 0}</div>`;
// }
// innerContainerBot.innerHTML = divBot;

// function etchGrid() {
//     document.querySelector(".divTopClass").addEventListener( "click", function () {
//         document.querySelector(".divTopClass").style.backgroundColor = "red";
//     });
// }
// etchGrid();

// THIS WORKS!!!
// function etchGrid() {
//   document.querySelectorAll(".divTopClass").forEach(function (div) {
//     div.addEventListener("click", function () {
//       this.style.backgroundColor = "red";
//     });
//   });
// }

// etchGrid();




// Get the color input and preview elements
const colorInput = document.querySelector("#colorInput");
const colorPreview = document.querySelector("#colorPreview");
const hexNameThatButton = document.querySelector("#colorPreview");

// Update the color preview on input change
colorInput.addEventListener("input", () => {
  const selectedColor = `${colorInput.value}80`;
  console.log(selectedColor);
  colorPreview.style.backgroundColor = selectedColor;
  hexNameThatButton.style.fontSize = "18px";
  hexNameThatButton.textContent = selectedColor;
    console.log(hexNameThatButton.textContent);

  // NEED TO DYNAMICALLY CHANGE TEXT COLOR AGAINST BACKGROUND...with a helper function...
  function hexToRgb(hex) {
    // Remove the hash (#) if it's present
    hex = hex.replace(/^#/, "");

    // Parse the hex values into their respective RGB components
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    // Return the RGB values as an object
    return { r, g, b };
  }

  // Example usage
  let hexColor = selectedColor;
  let rgbColor = hexToRgb(hexColor);
  console.log(rgbColor); // Output: { r: 124, g: 47, b: 47 }

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
setContrastColor()
});


//select all possible choices
// const colorChoices = document.querySelectorAll(".color-preview");

//!!!querySelectorAll  returns a collection of node elements. If you have multiple elements that match you selector you have to iterate over this collection and set the listener for each element. If you are sure there is only one element that matches the selector you can use querySelector to get the first element that matches. Then you can set the listener directly to the element.


//GETS CSS COLOR OF THE BUTTON...TEST CASE IS FOR A SINGLE BUTTON......................................
// document.addEventListener("DOMContentLoaded", function () {
//   const btnc01 = document.querySelector("#btnc01");
//   const buttonBgColor = window
//     .getComputedStyle(btnc01)
//     .getPropertyValue("background-color");

//   btnc01.addEventListener("click", function () {
//     alert("Button clicked! Background color is: " + rgbToHex(buttonBgColor));
//   });

//   // Helper function to convert RGB to hex
//   function rgbToHex(rgb) {
//     var rgbArray = rgb.match(/\d+/g);
//     var hex =
//       "#" +
//       ("0" + parseInt(rgbArray[0], 10).toString(16)).slice(-2) +
//       ("0" + parseInt(rgbArray[1], 10).toString(16)).slice(-2) +
//       ("0" + parseInt(rgbArray[2], 10).toString(16)).slice(-2);
//     return hex.toUpperCase();
//   }
// });

// 
let pickedColor;
const currentColorButton = document.querySelector("#current-color");

document.addEventListener("DOMContentLoaded", function () {
  const btnColors = document.querySelectorAll(".color-value");

  // function pickColor() {
    btnColors.forEach(function (button) {
      button.addEventListener("click", function () {
        const buttonBgColor = window
          .getComputedStyle(button)
          .getPropertyValue("background-color");
        pickedColor = rgbToHex(buttonBgColor);
        console.log(`AAAAA ${pickedColor}`); //DE-FINED HERE
        console.log(
          `Button clicked! Background color is: ${rgbToHex(buttonBgColor)}.`);

        currentColorButton.style.backgroundColor =
          pickedColor;
        currentColorButton.textContent = pickedColor;

      });
    });

    // Helper function to convert RGB to hex
    function rgbToHex(rgb) {
      const rgbArray = rgb.match(/\d+/g);
      const hex =
        "#" +
        ("0" + parseInt(rgbArray[0], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgbArray[1], 10).toString(16)).slice(-2) +
        // ("0" + parseInt(rgbArray[2], 10).toString(16)).slice(-2);
        ("0" + parseInt(rgbArray[2], 10).toString(16)).slice(-2) +
        ("80");
      return hex.toUpperCase();
    }
  // }
  // pickColor();
  console.log(`BBBBB ${pickedColor}`); //UNDEFINED HERE

});

  console.log(`CCCCC ${pickedColor}`); //UNDEFINED HERE




// THE ISSUE WITH BOTH FUNCTIONS BEING ACTIVATED WHEN TOGGLED.CHECKED IS TRUE IS BECAUSE THE TWO FUNCTIONS CREATED MULTIPLE EVENT LISTENERS THAT HAD UNINTENDED EFFECTS...

//ALSO NEEDED TO AD REMOVE EVENT LISTENERS!!!!

//THESE TWO ITEMS NEED NOTES...


let isDrawDetailOn = false;
let isDrawSketchOn = false;

function drawDetailOn(div) {
  div.addEventListener("click", handleDetail);
}
function handleDetail() {
  if (!toggleHideTop.checked)
  this.style.backgroundColor = pickedColor;
  // this.style.border = "blue";
}
function drawDetailOff(div) {
  div.removeEventListener("click", handleDetail);
}

//*******************************************************


// function drawSketchOn(div) {
//   div.addEventListener("mouseenter", handleSketch);
// }
// function handleSketch() {
//   this.style.backgroundColor = pickedColor;
//   // this.style.border = "red";
// }
// function drawSketchOff(div) {
//   div.removeEventListener("mouseenter", handleSketch);
// }

//FINALLY GOT THIS TO WORK...NOT SEEMLESS THOUGH...
let isMouseBtnPressed = false;

function drawSketchOn(div) {
  div.addEventListener("mousedown", function () {
    isMouseBtnPressed = true;
    console.log(`isMouseBtnPressed = ${isMouseBtnPressed}`);
  });
}

function drawSketchTempOff() {
  document.addEventListener("mouseup", function () {
    isMouseBtnPressed = false;
    console.log(`isMouseBtnPressed = ${isMouseBtnPressed}`);
  });
}
drawSketchTempOff();

document.addEventListener("mousemove", function (event) {
  if (isMouseBtnPressed && !toggleHideTop.checked) {
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
    console.log(`Toggled etch style position is ${toggleEtch.checked}`);
    isDrawSketchOn = true;
    isDrawDetailOn = false;

    divs.forEach(drawSketchOn);
    divs.forEach(drawDetailOff);
  } else {
    console.log(`Toggled etch style position is ${toggleEtch.checked}`);
    isDrawDetailOn = true;
    isDrawSketchOn = false;

    divs.forEach(drawDetailOn);
    divs.forEach(drawSketchOff);
  }
}

etchStyleSwitch();


// document.addEventListener("click", insertTile);

let tileBtn = document.querySelectorAll(".tile-btn");

let selectedTile;

document.addEventListener("click", insertTile);

function insertTile() {
  if (toggleHideTop.checked) {
    tileBtn.forEach(function () {
      console.log("Tile btn clicked......");

      })

  }
}


insertTile();