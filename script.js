/*
Andy Dong
October 29, 2018
Javascript Programming Challenge
Due December 21, 2018

A program that allows the user to play a game of Hangman.

TODO add calculations, graphics and animation (as required
by the evaluation criteria)
*/

// ----------STATIC----------


function test() {
    alert("testing");
}

// ASCII ids
const idA = 65;
const idSpace = 32;

// Returns whether or not the given character is alphabetic.
function isAlpha(c) {
    return c.toLowerCase() != c.toUpperCase();
}

// ----------END STATIC----------

var guesses; // guesses the user has taken
var answer;
var len;

var charGuessed; // whether each character has been guessed
var charLocations; // locations of each letter
var curState; // current state of the game


// Sets the answer to the current game and its length.
// answer should only contain alphabetic
// characters (case insensitive)
// ABSOLUTELY CANNOT CONTAIN UNDERSCORES
function setAnswer(ans) {
    // error checking for bad string
    for (let i = 0; i < len; i++) {
        assert(ans[i] == ' ' || isAlpha(ans[i]), "invalid answer string");
    }
    answer = ans.toUpperCase();
    len = ans.length;
}


// ----------GAME INITIALIZATION----------

// Initializes the charGuessed array.
function initCharGuessed() {
    charGuessed = new Array(26);
    charGuessed.fill(false, 0, 26);
}

// Initializes the charLocations array.
function initCharLocations() {
    charLocations = new Array(26);
    for (let i = 0; i <  26; i++) {
        charLocations[i] = [];
    }

    // Store indices containing each letter
    for (let i = 0; i < len; i++) {
        var chId = answer.charCodeAt(i);
        if (chId == idSpace) continue; // ignore spaces
        let v = chId - idA; // position in alphabet
        charLocations[v].push(i);
    }
}

// Initializes the curState array.
function initCurState() {
    curState = new Array(len);
    // for each index, if it is not a space, show a '_'
    for (let i = 0; i < len; i++) {
        curState[i] = (answer[i] == ' ' ? ' ' : '_');
    }
}

// Initializes a new game of Hangman.
function initGame(ans) {
    guesses = 0;
    setAnswer(ans);
    initCharGuessed();
    initCharLocations();
    initCurState();
}

// ----------END GAME INITIALIZATION----------


// Called when user clicks the "New game" button
function newGame() {
    initGame("Grace Hopper");
    console.log(`You got it! You used a total of ${guesses} guesses.`);
}

// Function that returns current state of game
function getCurState() {
    var s = '';
    for (let i = 0; i < len; i++) {
        s += curState[i] + ' ';
    }
    return s;
}

// Returns whether user has won the game; the user wins
// if and only if the current state does not contain any
// underscores
function hasWon() {
    for (let i = 0; i < len; i++) {
        if (curState[i] == '_') return false;
    }
    return true;
}

function isGuessValid(c) {
    // check if valid
    if (c.length != 1 || !isAlpha(c)) {
        alert("Sorry, invalid guess! Please enter an alphabetic character.");
        return false;
    }
    // check if this character has been guessed before
    c = c.toUpperCase();
    let v = c.charCodeAt(0) - idA;
    if (charGuessed[v]) {
        alert(`You have already guessed ${c}; please try again.`);
        return false;
    }
    return true;
}

// Called by btnGuess to guess a character
function guess() {
    let c = document.getElementById("txtGuess").value;
    guessChar(c);
    let s = `Current state:\n${getCurState()}\nYou have used ${guesses} guesses so far.`;
    if (hasWon()) {
        s += "\nCongratulations! You won!";
    }
    document.getElementById("pCurState").textContent = s;
}

// Processes guessing a character; changes the values
// of the variables and handles bad input.
function guessChar(c) {
    if (!isGuessValid(c)) return;

    c = c.toUpperCase();
    let v = c.charCodeAt(0) - idA;
    guesses++;
    charGuessed[v] = true;

    // show this character where it appears in the answer
    charLocations[v].forEach(function(i) {
        curState[i] = c;
    });
}

var btnNewGame = document.getElementById("btnNewGame");
document.getElementById("btnNewGame").addEventListener("click", test);
document.getElementById("btnNewGame").innerHTML = "test change";
