"use strict";

const fs = require("fs");
const { spawnSync } = require('child_process');

const isWin = require('os').platform().indexOf('win') != -1;

const buildDir = "public/";
const assetsDir = "assets/";

function copyDirectory(srcDir, destDir) {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir);
    }
 
    for (let entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
        let name = entry.name;
        if (entry.isDirectory()) {
            copyDirectory(srcDir + name + "/", destDir + name + "/");
        } else {
            fs.copyFileSync(srcDir + name, destDir + name);
        }
    }
}

function removeDirectory(dir) {
    for (let entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            removeDirectory(dir + entry.name + "/");
        } else {
            fs.unlinkSync(dir + entry.name);
        }
    }

    fs.rmdirSync(dir);
}

function commandExists(command) {
    return spawnSync(isWin ? "where" : "which", [command]).status == 0;
}

function main() {
    if (fs.existsSync(buildDir)) {
       removeDirectory(buildDir);
    }

    fs.mkdirSync(buildDir);
    fs.copyFileSync("index.html", buildDir + "index.html");
    copyDirectory(assetsDir, buildDir + assetsDir);

    if (!commandExists("pngquant")) {
        console.log("Skipping PNG compression (could not find `pngquant`)");
    } else {
        console.log("Compressing PNGs with pngquant...");
        let pngDir = buildDir + assetsDir + "stardew/";
        let pngs = fs.readdirSync(pngDir).map((filename) => pngDir + filename);
        spawnSync("pngquant", ["--ext", ".png", "--force", "--"].concat(pngs));    
    }

    if (!commandExists("prepa")) {
        console.log("Skipping JS and CSS minification (could not find `prepa`)");
    } else {
        console.log("Minifying JS and CSS with prepa...")
        spawnSync("prepa", ["min", "--replace", buildDir]);
    }

    console.log("Build complete");
}

main();
