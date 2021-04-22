

const targetDiv = document.getElementById("crosshair");

const crosshairImg = document.createElement("img");
crosshairImg.src = "/textures/crosshair.png";
crosshairImg.style = "width:2rem; height:2rem";

targetDiv.appendChild(crosshairImg);

export function targeting() {
// do nothing?
}