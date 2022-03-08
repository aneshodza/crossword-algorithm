console.log("creating crossword...");
const gridSize = 20
var input = require('./words.json');
input.words.sort((a, b) => {
    return b.length - a.length;
});
console.log('There are ' + input.words.length + ' words in the input file.');
var words = [];
input.words.forEach((word) => {
    words.push({ word: word.replace(/ /g, "-"), length: word.length, placed: false });
});

console.log("Note that words above 18 characters will be deleted")
words = words.filter((index) => index.word.length < 18)
console.log("There are " + words.length + " words left")
console.log(words)
let pastWords = words

const printGrid = () => {
    for (let i = 0; i < crossword.length; i++) {
        console.log(crossword[i].join(" "));
    }
}

const placeWord = (wordIndex, coords) => {
    let x = coords[0];
    let y = coords[1];
    let direction = coords[2];
    let wordLength = words[wordIndex].word.length;
    let wordArray = words[wordIndex].word.split("");
    if (direction === "across") {
        for (let i = 0; i < wordLength; i++) {
            crossword[y][x + i] = wordArray[i];
        }
        words[wordIndex] = { ...words[wordIndex], placed: true, direction: "across", xPos: x, yPos: y }
    } else {
        for (let i = 0; i < wordLength; i++) {
            crossword[y + i][x] = wordArray[i];
        }
        words[wordIndex] = { ...words[wordIndex], placed: true, direction: "down", xPos: x, yPos: y }
    }
    let tempArr = []
    for (let i = 0; i < words.length; i++) {
        if (wordIndex === i) {
            tempArr.push(words[i])
        }
    }
    pastWords = tempArr
    console.log(pastWords)
}

const findWord = (initialWordIndex) => {
    console.log("Searching for words with matching letters")
    let matches = []
    for (let i = 0; i < words.length; i++) {
        for (let j = 0; j < words[initialWordIndex].word.length; j++) {
            if (!pastWords.includes(words[i])) {
                let pos = words[i].word.search(words[initialWordIndex].word.charAt(j))
                if (pos > -1) {
                    if (words[initialWordIndex].direction == "across") {
                        if (words[initialWordIndex].yPos + words[i].word.length-1 - pos > gridSize - 1 || words[initialWordIndex].yPos - pos < 0) {
                        } else {
                            matches.push({ word: words[i].word, newWordIndex: i, posNew: pos, posInit: j, letter: words[initialWordIndex].word.charAt(j) })
                        }
                    } else {

                    }
                    
                }
            }
        }
    }
    return { wordIndex: initialWordIndex, found: matches[Math.floor(Math.random() * matches.length)] }
    //return { wordIndex: initialWordIndex, found: matches[7] }
}

const foundHandler = (initialWordIndex) => {
    let find = findWord(initialWordIndex)
    console.log(find)
    console.log("Initial word: ")
    console.log(words[find.wordIndex])
    if (words[find.wordIndex].direction == "across") {
        placeWord(find.found.newWordIndex, [find.found.posInit + words[find.wordIndex].xPos, words[find.wordIndex].yPos - find.found.posNew, "down"])
    } else {

    }

}

var crossword = Array(gridSize)
for (let i = 0; i < crossword.length; i++) {
    crossword[i] = Array(gridSize)
    for (let j = 0; j < crossword[i].length; j++) {
        crossword[i][j] = ".";
    }
}
console.log("Laying first word...")
//The placement should be adjusted to the length of the word so it sits in the middle of the grid
placeWord(0, [Math.floor(gridSize / 2) - Math.floor(words[0].length / 2), Math.ceil(gridSize/2), "across"]);
foundHandler(0)
printGrid()

