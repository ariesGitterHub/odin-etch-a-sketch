let blockNumber = 256;
// let blockNumber = 144;
// let blockNumber = 1000;

let div = "";
// const newDiv = document.createElement("div");

const innerDivContainer = document.querySelector("inner-div-container");
// console.log("TEST...");

for (let i = 0; i < blockNumber; i++) {
      div += `<div>${i + 1}</div>`;
    }
    
innerDivContainer.innerHTML = div;


createBlocks();