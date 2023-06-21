// read all json files from climate folder and get the frequency of the author names
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "climate");
const files = fs.readdirSync(dir);
const allAuthors = [];
const authorFreq = {};
const authorFreqArr = [];
let authorFreqArrSortedTop10 = [];

files.forEach((file, index) => {
  //   console.log(file);

  //   read the contents of the json
  if (index) {
    const data = fs.readFileSync(`${dir}/${file}`, "utf8");

    // get all the keys from the json
    let keys = Object.keys(JSON.parse(data));

    // remove the last key which is the headlineWords
    keys.pop();

    // for each key, get the author name from each array and add it to the authors array
    keys.forEach((key, index) => {
      //   get the article
      let article = JSON.parse(data)[key];
      let authors = [];
      article.items.forEach((item, index) => {
        const authorNames = item.person.forEach((person, index) => {
          // return the author name
          authors.push(person.firstname + " " + person.lastname);
        });

        // add the authors to the allAuthors array
        allAuthors.push(authors);
      });
    });
  }
});

// create an object array of all the authors and their frequency
allAuthors.forEach((author, index) => {
  author.forEach((name, index) => {
    if (authorFreq[name]) {
      authorFreq[name] += 1;
    } else {
      authorFreq[name] = 1;
    }
  });
});

// sort the authorFreq object by frequency
for (let author in authorFreq) {
  authorFreqArr.push([author, authorFreq[author]]);
}

authorFreqArr.sort(function (a, b) {
  return b[1] - a[1];
});

// get the top 10 authors
authorFreqArrSortedTop10 = authorFreqArr.slice(0, 10);
console.log(authorFreqArrSortedTop10.join("\n"));
