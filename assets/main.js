"use strict";

const assetsPath = "assets/stardew/"

const shedWidth = 390;
const shedHeight = 437;

let selectedWallpaper = undefined;
let selectedFlooring = undefined;

let images = Object.create(null);

let previewRegion = document.getElementById("preview-region");
let previewArea = document.getElementById("preview-area");
let previewCanvas = document.getElementById("preview-canvas");
let selectionRegion = document.getElementById("selection-region");
let wallpaperArea = document.getElementById("wallpaper-area");
let wallpaperContents = document.getElementById("wallpaper-contents");
let flooringArea = document.getElementById("flooring-area");
let flooringContents = document.getElementById("flooring-contents");

function select(wallpaperId, flooringId) {
    if (wallpaperId !== null && wallpaperId !== selectedWallpaper) {
        if (selectedWallpaper !== undefined) {
            document.getElementById("wallpaper:" + selectedWallpaper).classList.remove("selected");
        }

        selectedWallpaper = wallpaperId;
        document.getElementById("wallpaper:" + selectedWallpaper).classList.add("selected");
    }

    if (flooringId !== null && flooringId !== selectedFlooring) {
        if (selectedFlooring !== undefined) {
            document.getElementById("flooring:" + selectedFlooring).classList.remove("selected");
        }

        selectedFlooring = flooringId;
        document.getElementById("flooring:" + selectedFlooring).classList.add("selected");
    }
}

function imageLoadPromise(imageElement) {
    return new Promise((resolve, reject) => {
        imageElement.addEventListener("load", () => { resolve(); });
        imageElement.addEventListener("error", () => { reject(); });
    });
}

function setup() {
    let loadingImages = [];

    // == Preview Region == //

    previewCanvas.width = shedWidth;
    previewCanvas.height = shedHeight;
    previewArea.appendChild(previewCanvas);

    let shedBackground = document.createElement("img");
    shedBackground.src = assetsPath + "Shed_Inside.png";
    shedBackground.style.display = "none";
    previewArea.appendChild(shedBackground);

    loadingImages.push(imageLoadPromise(shedBackground));
    images["background/shed"] = shedBackground;

    // == Selection Region == //

    // -- Wallpaper Area -- //
    let wallpaperPromises = setupWallpaperChoices(wallpaperContents);
    loadingImages = loadingImages.concat(wallpaperPromises);

    // -- Flooring Area -- //
    let flooringPromises = setupFlooringChoices(flooringContents);
    loadingImages = loadingImages.concat(flooringPromises);

    // == Load Handler == //
    Promise.all(loadingImages).then(() => {
        select("001", "01");
        drawShed();
        document.body.classList.remove("is-loading");
        centerPreview();
    });
}

function setupWallpaperChoices(container) {
    const numChoices = 112;
    let loadingImages = [];

    for (let i = 1; i <= numChoices; i++) {
        let id = i.toString();
        id = "0".repeat(3 - id.length) + id;

        let choice = document.createElement("span");
        choice.id = "wallpaper:" + id;
        choice.classList.add("wallpaper-choice");
        choice.addEventListener("click", () => { select(id, null); drawShed(); });
        choice.addEventListener("mouseenter", () => { drawShed(id, undefined); });
        choice.addEventListener("mouseleave", () => { drawShed(); });
        container.appendChild(choice);
    
        let icon = document.createElement("img");
        icon.classList.add("wallpaper-icon");
        icon.src = assetsPath + "Wallpaper_000_Icon.png".replace("000", id);
        choice.appendChild(icon);
    
        let tile = document.createElement("img");
        tile.src = assetsPath + "Wallpaper_000.png".replace("000", id);
        tile.style.display = "none";
        choice.appendChild(tile);

        loadingImages.push(imageLoadPromise(icon));
        loadingImages.push(imageLoadPromise(tile));
        images["wallpaper/" + id] = tile;
    }

    return loadingImages;
}

function setupFlooringChoices(container) {
    const numChoices = 56;
    let loadingImages = [];

    for (let i = 1; i <= numChoices; i++) {
        let id = i.toString();
        id = "0".repeat(2 - id.length) + id;

        let choice = document.createElement("span");
        choice.id = "flooring:" + id;
        choice.classList.add("flooring-choice");
        choice.addEventListener("click", () => { select(null, id); drawShed(); });
        choice.addEventListener("mouseenter", () => { drawShed(undefined, id); });
        choice.addEventListener("mouseleave", () => { drawShed(); });
        container.appendChild(choice);
    
        let icon = document.createElement("img");
        icon.classList.add("flooring-icon");
        icon.src = assetsPath + "Flooring_00_Icon.png".replace("00", id);
        choice.appendChild(icon);
    
        let tile = document.createElement("img");
        tile.src = assetsPath + "Flooring_00.png".replace("00", id);
        tile.style.display = "none";
        choice.appendChild(tile);

        loadingImages.push(imageLoadPromise(icon));
        loadingImages.push(imageLoadPromise(tile));
        images["flooring/" + id] = tile;
    }

    return loadingImages;
}

function drawShed(wallpaperId = selectedWallpaper, flooringId = selectedFlooring) {
    let context = previewCanvas.getContext("2d");

    context.drawImage(images["background/shed"], 0, 0, shedWidth, shedHeight);

    // Draw flooring first since the wallpaper casts a shadow
    context.save();
    drawFlooring(context, flooringId);
    context.restore();

    context.save();
    drawWallpaper(context, wallpaperId);
    context.restore();
}

function drawWallpaper(context, id) {
    context.beginPath();
    context.moveTo(19, 20); // top left
    context.lineTo(19, 116); // bottom left
    context.lineTo(371, 116); // bottom right
    context.lineTo(371, 20); // top right
    context.clip();

    let tile = images["wallpaper/" + id];
    let tileWidth = 96;
    let xOffset = 19;
    let yOffset = 20;

    for (var x = 0; x <= 3; x++) {
        context.drawImage(tile, xOffset + x * tileWidth, yOffset);
    }
}

function drawFlooring(context, id) {
    context.beginPath();
    context.moveTo(19, 110); // top left
    context.lineTo(19, 376); // bottom left 1
    context.lineTo(32, 388); // bottom left 2
    context.lineTo(177, 388); // middle left 1
    context.lineTo(179, 390); // middle left 2
    context.lineTo(179, 420); // middle left 3
    context.lineTo(211, 420); // middle right 3
    context.lineTo(211, 390); // middle right 2
    context.lineTo(213, 388); // middle right 1
    context.lineTo(358, 388); // bottom left 2
    context.lineTo(371, 376); // bottom left 1
    context.lineTo(371, 110); // top right
    context.clip();

    let tile = images["flooring/" + id];
    let tileWidth = 128;
    let tileHeight = 128;
    let xOffset = 19;
    let yOffset = 110 - 90;

    for (var x = 0; x <= 4; x++) {
        for (var y = 0; y <= 3; y++) {
            context.drawImage(tile, xOffset + x * tileWidth, yOffset + y * tileHeight);
        }
    }
}

function centerPreview() {
    if (window.innerWidth < 720) {
        previewArea.style.top = "";
        return;
    }

    let yOffset = (window.innerHeight - previewArea.getBoundingClientRect().height) / 3;
    yOffset = Math.max(yOffset, 32);
    yOffset = Math.round(yOffset);

    previewArea.style.top = yOffset + "px";
}

function main() {
    setup();
    window.addEventListener("resize", centerPreview);
}

main();
