/*
Andy Dong
Mr. Cutten
ICS 3U
December 21, 2018

Javascript Programming Challenge

A program that allows the user to play a game of Hangman.

TODO add calculations, graphics, and animation (as required
by the evaluation criteria)

QUESTION: does generating a random number count as a calculation?
*/

// ----------STATIC----------

var answers; // master array of all possible answers

// HTML elements for easier reference in code
var btnGuess = document.getElementById('btnGuess');
var btnNewGame = document.getElementById('btnNewGame');
var txtGuess = document.getElementById('txtGuess');
var preCurState = document.getElementById('preCurState');

// when page loads, cannot guess a character
btnGuess.disabled = true;

// ASCII id for the character 'A'
const idA = 65;

// Returns whether or not the given character is alphabetic.
function isAlpha(c) {
    return c.toLowerCase() != c.toUpperCase();
}

// Returns a random integer in the range [a, b].
function randInt(a, b) {
    return a + Math.floor(Math.random() * (b - a + 1));
    // QUESTION: does this count as a calculation?
}

// ----------END STATIC----------


var guesses; // guesses the user has taken
var correct; // guesses the user has taken which were characters in the answer
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
    answer = ans.toUpperCase();
    len = answer.length;
}

// ----------GAME INITIALIZATION----------

// Reads in all the answers from the given data file.
function initAnswers() {
    answers = [
        'Brawl Stars',
        'Grace Hopper',
        'unambiguous',
        'jazz',
        'legendary'
    ];
    // assumption that all file strings are valid: alphabetic and nonempty
    // TODO: use file input/output?
    // http://qnimate.com/javascript-create-file-object-from-url/
}

// Initializes the charGuessed array.
function initCharGuessed() {
    charGuessed = new Array(26);
    charGuessed.fill(false, 0, 26);
}

// Initializes the charLocations array.
function initCharLocations() {
    charLocations = new Array(26);
    for (let i = 0; i < 26; i++) {
        charLocations[i] = [];
    }

    // Store indices containing each letter
    for (let i = 0; i < len; i++) {
        if (answer.charAt(i) == ' ') continue; // ignore spaces
        let v = answer.charCodeAt(i) - idA; // position in alphabet
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

// Called when user clicks the 'New game' button
function newGame() {
    guesses = 0;
    correct = 0;
    initAnswers();
    setAnswer(answers[randInt(0, answers.length - 1)]);
    initCharGuessed();
    initCharLocations();
    initCurState();
    updateState();
    btnGuess.disabled = false;
    txtGuess.focus();
}

// ----------END GAME INITIALIZATION----------



// ----------USER INTERACTION----------

// Returns whether user has won the game; the user wins
// if and only if the current state does not contain any
// underscores
function hasWon() {
    for (let i = 0; i < len; i++) {
        if (curState[i] == '_') return false;
    }
    return true;
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
    if (charLocations[v].length > 0) {
        correct++;
    }
}

// Returns current state of game (for display only)
function getCurState() {
    var s = '';
    for (let i = 0; i < len; i++) {
        if (curState[i] == ' ') s += '  '; // exaggerate spaces in word
        else s += curState[i];
        s += ' ';
    }
    return s;
}

// Returns whether the given string is a valid guess
// and handles invalid guesses accordingly.
function isGuessValid(c) {
    // check if valid
    if (c.length != 1 || !isAlpha(c)) {
        alert('Sorry, invalid guess! Please enter an alphabetic character.');
        return false;
    }
    c = c.toUpperCase();
    // check if this character has been guessed before
    let v = c.charCodeAt(0) - idA;
    if (charGuessed[v]) {
        alert(`You have already guessed ${c}; please try again.`);
        return false;
    }
    return true;
}

// Updates the state of the game displayed to the user.
// This includes letters/underscores, guesses used,
// incorrect guesses, and whether user has won.
function updateState() {
    let incorrect = guesses - correct;
    let s = `Current state:<br>${getCurState()}<br>`;
    s += `You have used ${guesses} `
        + (guesses == 1 ? 'guess' : 'guesses') + ' so far.<br>';
    s += `You have guessed incorrectly ${incorrect} `
        + (incorrect == 1 ? 'time' : 'times') + '.';
    if (hasWon()) {
        s += '<br>Congratulations! You won!';
        btnGuess.disabled = true;
    }
    preCurState.innerHTML = s;
}

// Called by btnGuess to guess a character
function guess() {
    let c = txtGuess.value;
    guessChar(c);
    updateState();
    txtGuess.value = '';
    txtGuess.focus();
}
