"use strict";

const assetsPath = "stardew-assets/"
const numWalls = 112;
const numFloor = 56;

for (let i = 1; i <= numWalls; i++) {
    let choice = document.createElement('div');
    choice.style.float = "left";

    let id = i.toString();
    id = "0".repeat(3 - id.length) + id;

    let icon = document.createElement('img');
    icon.src = assetsPath + "Wallpaper_000_Icon.png".replace("000", id);
    icon.style.width = "36px";
    icon.style.marginRight = "2px";

    // load the wallpaper tile, but don't show it
    let wall = document.createElement('img');
    wall.id = "wall-" + id;
    wall.src = assetsPath + "Wallpaper_000.png".replace("000", id);
    wall.style.display = "none";

    choice.appendChild(icon);
    choice.appendChild(wall);

    choice.addEventListener("click", (e) => {
        selectedWall = id;
        draw();
    });

    document.getElementById("wall-choices").appendChild(choice);
}

for (let i = 1; i <= numFloor; i++) {
    let choice = document.createElement('div');
    choice.style.float = "left";

    let id = i.toString();
    id = "0".repeat(2 - id.length) + id;

    let icon = document.createElement('img');
    icon.src = assetsPath + "Flooring_00_Icon.png".replace("00", id);
    icon.style.width = "42px";
    icon.style.marginRight = "2px";

    // load the flooring tile, but don't show it
    let floor = document.createElement('img');
    floor.id = "floor-" + id;
    floor.src = assetsPath + "Flooring_00.png".replace("00", id);
    floor.style.display = "none";

    choice.appendChild(icon);
    choice.appendChild(floor);

    choice.addEventListener("click", (e) => {
        selectedFloor = id;
        draw();
    });

    document.getElementById("floor-choices").appendChild(choice);
}

let selectedWall = "001";
let selectedFloor = "01";

function draw() {
    const width = 390;
    const height = 437;
    const padding = 10;

    let canvas = document.getElementById("shed-canvas");
    canvas.width = width + 2 * padding;
    canvas.height = height + 2 * padding;
    canvas.style.display = "";

    let context = canvas.getContext("2d");

    context.fillRect(0, 0, width + 2 * padding, height + 2 * padding);
    context.drawImage(document.getElementById("shed-bg"), padding, padding, width, height);

    context.save();

    context.beginPath();
    context.moveTo(padding + 19, padding + 110);
    context.lineTo(padding + 19, padding + 376);
    context.lineTo(padding + 32, padding + 388);
    context.lineTo(padding + 179, padding + 388);
    context.lineTo(padding + 179, padding + 420);
    context.lineTo(padding + 211, padding + 420);
    context.lineTo(padding + 211, padding + 388);
    context.lineTo(padding + 358, padding + 388);
    context.lineTo(padding + 371, padding + 376);
    context.lineTo(padding + 371, padding + 110);
    context.clip();

    for (var x = 0; x <= 4; x++) {
        for (var y = 0; y <= 3; y++) {
            context.drawImage(
                document.getElementById("floor-" + selectedFloor),
                padding + 19 + x * 128,
                padding + 110 - 90 + y * 128,
            );
        }
    }

    context.restore();

    context.save();

    context.beginPath();
    context.moveTo(padding + 19, padding + 20);
    context.lineTo(padding + 19, padding + 116);
    context.lineTo(padding + 371, padding + 116);
    context.lineTo(padding + 371, padding + 20);
    context.clip();

    for (var x = 0; x <= 3; x++) {
        context.drawImage(
            document.getElementById("wall-" + selectedWall),
            padding + 19 + x * 96,
            padding + 20,
        );
    }

    context.restore();
}

setTimeout(draw, 250);
