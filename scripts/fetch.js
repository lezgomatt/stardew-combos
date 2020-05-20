"use strict";

const fs = require("fs");
const https = require("https");

const assetsDir = "assets/stardew/"

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode >= 400) {
                reject(res.statusCode);
            }

            let body = "";
            res.setEncoding("utf8");
            res.on("data", (chunk) => { body += chunk; });
            res.on("end", () => { resolve(body); });
        }).on("error", (err) => { reject(err); });
    });
}

function downloadFile(srcUrl, destPath) {
    let out = fs.createWriteStream(destPath);

    return new Promise((resolve, reject) => {
        https.get(srcUrl, (res) => {
            res.pipe(out);
            res.on("end", () => { resolve(); });
        }).on("error", (err) => { reject(err); });
    });
}

function downloadSet(matches) {
    let found = new Set();
    let promises = [];

    for (let [_, path, filename] of matches) {
        if (found.has(filename)) {
            continue;
        }

        found.add(filename);
        promises.push(
            downloadFile("https://stardewvalleywiki.com" + path, assetsDir + filename)
            .then(() => { console.log(`Downloaded "${filename}"`); })
        );
    }

    return promises;
}

async function downloadShedBackground() {
    console.log("Downloading shed background...");
    await downloadFile("https://stardewvalleywiki.com/mediawiki/images/4/42/Shed_Inside.png", assetsDir + "Shed_Inside.png");
    console.log(`Downloaded "Shed_Inside.png"`);
}

async function downloadWallpapers() {
    console.log("Downloading wallpapers...");
    let html = await get("https://stardewvalleywiki.com/Wallpaper");

    let iconPatt = /src="(\/mediawiki\/images\/.+\/.+\/(Wallpaper_\d{3}_Icon.png))"/g;
    let icons = downloadSet(html.matchAll(iconPatt));
    await Promise.all(icons);

    let wallPatt = /src="(\/mediawiki\/images\/.+\/.+\/(Wallpaper_\d{3}.png))"/g;
    let wallpapers = downloadSet(html.matchAll(wallPatt));
    await Promise.all(wallpapers);

    let numIcons = icons.length;
    let numWallpapers = wallpapers.length;
    if (numIcons !== numWallpapers) {
        throw new Error(`Mismatch in wallpaper icons: got ${numIcons} icons for ${numWallpapers} wallpapers`);
    }

    console.log(`Downloaded ${numWallpapers} wallpapers`);
}

async function downloadFlooring() {
    console.log("Downloading flooring...");
    let html = await get("https://stardewvalleywiki.com/Flooring");

    let iconPatt = /src="(\/mediawiki\/images\/.+\/.+\/(Flooring_\d{2}_Icon.png))"/g;
    let icons = downloadSet(html.matchAll(iconPatt));
    await Promise.all(icons);

    let floorPatt = /src="(\/mediawiki\/images\/.+\/.+\/(Flooring_\d{2}.png))"/g;
    let flooring = downloadSet(html.matchAll(floorPatt));
    await Promise.all(flooring);

    let numIcons = icons.length;
    let numFlooring = flooring.length;
    if (numIcons !== numFlooring) {
        throw new Error(`Mismatch in flooring icons: got ${numIcons} icons for ${numFlooring} flooring`);
    }

    console.log(`Downloaded ${numFlooring} flooring`);
}

async function main() {
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir);
    }

    await downloadShedBackground();
    await downloadWallpapers();
    await downloadFlooring();
}

main();
