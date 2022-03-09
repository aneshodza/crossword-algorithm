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

console.log("Note that words above " + Number(gridSize - 2) + " characters will be deleted")
words = words.filter((index) => index.word.length < gridSize - 2)
console.log("There are " + words.length + " words left")
console.log(words)
let pastWords = []

const printGrid = () => {
    for (let i = 0; i < crossword.length; i++) {
        console.log(crossword[i].join(" "));
    }
}

const isFree = (newWord, coords) => {
    //Check if the coords given ever intersect with another word return false if it does
    let x = coords[0];
    let y = coords[1];
    let direction = coords[2];
    let wordLength = newWord.length;
    if (direction === "across") {
        for (let i = 0; i < wordLength; i++) {
            if (crossword[y][x + i] !== "." && crossword[y][x + i] !== newWord.charAt(i)) {
                return false;
            }
        }
    } else {
        for (let i = 0; i < wordLength; i++) {
            if (crossword[y + i][x] !== "." && crossword[y + i][x] !== newWord.charAt(i)) {
                return false;
            }
        }
    }
    return true;
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

    let tempArr = pastWords
    for (let i = 0; i < words.length; i++) {
        if (wordIndex === i) {
            tempArr.push(words[i])
        }
    }
    pastWords = tempArr
}

const findWord = () => {
    let matches = []
    for (let index = 0; index < pastWords.length; index++) {
        for (let i = 0; i < words.length; i++) {
            for (let j = 0; j < pastWords[index].word.length; j++) {
                if (!pastWords.includes(words[i])) {
                    let pos = words[i].word.search(pastWords[index].word.charAt(j))
                    if (pos > -1) {
                        if (pastWords[index].direction == "across") {
                            if (pastWords[index].yPos + words[i].word.length - 1 - pos > gridSize - 1 || pastWords[index].yPos - pos < 0) {
                            } else {
                                if (isFree(words[i].word, [pastWords[index].xPos + j, pastWords[index].yPos - pos, "down"]))
                                    matches.push({ word: words[i].word, newWordIndex: i, posNew: pos, posInit: j, letter: pastWords[index].word.charAt(j), wordIndex: index })
                            }
                        } else {
                            if (pastWords[index].xPos + words[i].word.length - 1 - pos > gridSize - 1 || pastWords[index].xPos - pos < 0) {
                            } else {
                                if (isFree(words[i].word, [pastWords[index].xPos - pos, pastWords[index].yPos + j, "across"])) {
                                    matches.push({ word: words[i].word, newWordIndex: i, posNew: pos, posInit: j, letter: pastWords[index].word.charAt(j), wordIndex: index })
                                }
                            }

                        }
                    }
                }
            }
        }
    }
    return matches[Math.floor(Math.random() * matches.length)]
}

const findAndPlace = () => {
    let find = findWord()
    if (find === undefined) {
        return true
    }
    if (pastWords[find.wordIndex].direction == "across") {
        placeWord(find.newWordIndex, [find.posInit + pastWords[find.wordIndex].xPos, pastWords[find.wordIndex].yPos - find.posNew, "down"])
    } else {
        placeWord(find.newWordIndex, [pastWords[find.wordIndex].xPos - find.posNew, pastWords[find.wordIndex].yPos + find.posInit, "across"])
    }
    return false
}
var crossword = Array(gridSize)
const createCrossword = () => {
    for (let i = 0; i < crossword.length; i++) {
        crossword[i] = Array(gridSize)
        for (let j = 0; j < crossword[i].length; j++) {
            crossword[i][j] = ".";
        }
    }
    placeWord(0, [Math.floor(gridSize / 2) - Math.floor(words[0].length / 2), Math.ceil(gridSize / 2), "across"]);
    let exit = false
    while (!exit) {
        exit = findAndPlace()
    }
    printGrid()
}

createCrossword()



