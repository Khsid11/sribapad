const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

const setCanvasBackground = () => {
    // setting whole canvas background to white, so the downloaded img background will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color
}

window.addEventListener("load", () => {
    // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});
const drawAngry = (e) => {
    ctx.beginPath(); // creating new path to draw angry face
    ctx.arc(e.offsetX, e.offsetY, 50, 0, 2 * Math.PI); // creating circle for face
    ctx.moveTo(e.offsetX - 20, e.offsetY - 20); // moving to left eyebrow position
    ctx.lineTo(e.offsetX - 10, e.offsetY - 30); // creating left eyebrow
    ctx.moveTo(e.offsetX + 20, e.offsetY - 20); // moving to right eyebrow position
    ctx.lineTo(e.offsetX + 10, e.offsetY - 30); // creating right eyebrow
    ctx.moveTo(e.offsetX - 25, e.offsetY + 10); // moving to left eye position
    ctx.arc(e.offsetX - 20, e.offsetY + 10, 5, 0, 2 * Math.PI); // creating left eye
    ctx.moveTo(e.offsetX + 25, e.offsetY + 10); // moving to right eye position
    ctx.arc(e.offsetX + 20, e.offsetY + 10, 5, 0, 2 * Math.PI); // creating right eye
    ctx.moveTo(e.offsetX - 30, e.offsetY + 30); // moving to left mouth position
    ctx.lineTo(e.offsetX + 30, e.offsetY + 30); // creating mouth
    ctx.strokeStyle = 'red'; // setting stroke color to red
    ctx.lineWidth = 5; // setting line width to 5
    ctx.stroke(); // drawing border
}



const drawSmiley = (e) => {
    ctx.beginPath(); // creating new path to draw smiley
    ctx.arc(e.offsetX, e.offsetY, 50, 0, 2 * Math.PI); // creating circle for face
    ctx.moveTo(e.offsetX + 35, e.offsetY); // moving to right side of circle
    ctx.arc(e.offsetX, e.offsetY, 35, 0, Math.PI, false); // creating arc for smile
    ctx.moveTo(e.offsetX - 10, e.offsetY - 10); // moving to left eye position
    ctx.arc(e.offsetX - 15, e.offsetY - 10, 5, 0, 2 * Math.PI); // creating left eye
    ctx.moveTo(e.offsetX + 20, e.offsetY - 10); // moving to right eye position
    ctx.arc(e.offsetX + 15, e.offsetY - 10, 5, 0, 2 * Math.PI); // creating right eye
    ctx.stroke(); // drawing border
}

 


const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // passing brushSize as line width
    ctx.strokeStyle = selectedColor; // passing selectedColor as stroke style
    ctx.fillStyle = selectedColor; // passing selectedColor as fill style
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return; // if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas

    if(selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool is eraser then set strokeStyle to white 
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
        ctx.stroke(); // drawing/filling line with color
    } else if(selectedTool === "Angry"){
        drawAngry(e);
    } else {
        drawSmiley(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // passing slider value as brushSize

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color button
        // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);