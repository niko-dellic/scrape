//read all of the files in the directory and visualize a d3 timeline of the article names
const fs = require("fs");
const path = require("path");
const d3 = require("d3");
const { json } = require("d3");

// read all of the files in the directory and get the name of the articles and the year
const directory = "./data";
const files = fs.readdirSync(directory);

console.log(files);
