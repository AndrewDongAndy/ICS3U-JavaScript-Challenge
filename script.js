/*
Andy Dong
Mr. Cutten
ICS 3U
December 21, 2018

Javascript Programming Challenge

A program that allows the user to play Hangman.

TODO add graphics, and animation (as required
by the evaluation criteria)

QUESTION: does generating a random number count as a calculation?
ANSWER: yes
*/

// ----------STATIC----------

const MAX_ANS_LEN = 30; // longest answer allowed

var answers; // master array of all possible answers

// HTML elements for easier reference in code
var btnGuess = document.getElementById('btn-guess');
var btnNewGame = document.getElementById('btn-new-game');
var canvHangman = document.getElementById('canv-hangman'); // not implemented
var ctx = canvHangman.getContext('2d');
var divGuessing = document.getElementById('div-guessing');
var divStartGame = document.getElementById('div-start-game');
var preCurState = document.getElementById('pre-cur-state');
var txtGuess = document.getElementById('txt-guess');

// ASCII id for the character 'A'
const ID_A = 65;

// Returns whether or not the given character is alphabetic.
function isAlpha(c) {
    return c.toLowerCase() != c.toUpperCase();
}

// Returns a random integer in the range [a, b].
function randInt(a, b) {
    return a + Math.floor(Math.random() * (b - a + 1));
}

// ----------END STATIC----------


var guesses; // guesses the user has taken
var incorrect; // guesses the user has taken which were not characters in the answer
var answer;
var len;

var charGuessed; // whether each character has been guessed
var charLocations; // locations of each letter; 2D array
var curState; // current state of the game


// Sets the answer to the current game and its length.
// answer should only contain alphabetic
// characters (case insensitive)
// ABSOLUTELY CANNOT CONTAIN UNDERSCORES
function setAnswer(ans) {
    // assuming ans is normalized
    console.assert(isValidAnswer(ans), 'invalid answer!!!');
    answer = ans;
    len = answer.length;
    initCharGuessed();
    initCharLocations();
    initCurState();
    updateState();
}

// Sets a random answer for a new regular game.
function setRandomAnswer() {
    setAnswer(answers[randInt(0, answers.length - 1)]);
}


// ----------UTILITY FUNCTIONS----------

// Returns whether a string is a valid answer string:
// each character must be alphabetic or a space.
function isValidAnswer(s) {
    if (s.length == 0 || s.length > MAX_ANS_LEN) return false;
    for (let i = 0; i < s.length; i++) {
        let c = s.charAt(i);
        if (!isAlpha(c) && c != ' ') return false;
    }
    return true;
}

// Returns normalized string (all uppercase with single spaces
// between words)
function normalized(s) {
    s = s.trim();
    let res = '';
    for (let i = 0; i < s.length; i++) {
        // below: works due to short-circuiting of || operator
        if (s.charAt(i) != ' ' || res.charAt(res.length - 1) != ' ')
            res += s.charAt(i);
    }
    return res.toUpperCase();
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

// Returns whether user has won the game; the user wins
// if and only if the current state does not contain any
// underscores
function hasWon() {
    for (let i = 0; i < len; i++) {
        if (curState[i] == '_') return false;
    }
    return true;
}

// ----------END UTILITY FUNCTIONS----------


// ----------GAME INITIALIZATION----------

// Reads in all the answers from the given data file.
function initAnswers() {
    answers = [
        'Brawl Stars',
        'Grace Hopper',
        'unambiguous',
        'jazz',
        'legendary',
        'conservatory',
        'galaxy',
        'avid',
        'caterpillar',
        'laptop',
        'programming',
        'xylophone',
        'assassin',
        'Fahrenheit',
        'hydrogen',
        'phenolphthalein',
        'combustion',
        'ultimate',
        'request',
        'trigger',
        'assumption',
        'pencil',
        'browse',
        'censorship'
    ];
    // normalize all answers
    for (let i = 0; i < answers.length; i++) {
        answers[i] = normalized(answers[i]);
    }
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
    for (let i = 0; i < len; i++) {
        if (answer.charAt(i) == ' ') continue; // ignore spaces
        let v = answer.charCodeAt(i) - ID_A; // position in alphabet
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

function showGameElements() {
    divGuessing.hidden = false;
    ctx.clearRect(0, 0, canvHangman.width, canvHangman.height);
    canvHangman.hidden = false;
    updateHook();
}

// Called when user clicks btnNewGame
function newGame() {
    guesses = 0;
    incorrect = 0;
    setRandomAnswer();
    showGameElements();
    txtGuess.focus();
}

// Called when user clicks btnCustomGame
function customGame() {
    guesses = 0;
    incorrect = 0;
    let ans = prompt(`Enter an answer string; alphabetic characters only, `
        + `maximum ${MAX_ANS_LEN} characters.`);
    if (ans == null) return; // user cancelled the prompt
    ans = normalized(ans);
    if (!isValidAnswer(ans)) {
        alert('Sorry, that is not a valid answer string.');
        return;
    }
    setAnswer(ans);
    showGameElements();
    txtGuess.focus();
    alert(`Success! Answer set as: ${answer}`);
}

// ----------END GAME INITIALIZATION----------



// ----------USER INTERACTION----------

// Processes guessing a character; changes the values
// of the variables and handles bad input.
function guessChar(c) {
    if (!isGuessValid(c)) return;
    c = c.toUpperCase();
    let v = c.charCodeAt(0) - ID_A;
    guesses++;
    charGuessed[v] = true;
    // show this character where it appears in the answer
    charLocations[v].forEach(function(i) {
        curState[i] = c;
    });
    if (charLocations[v].length == 0) {
        incorrect++;
        updateHook();
    }
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
    let v = c.charCodeAt(0) - ID_A;
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
    let s = `${getCurState()}<br><br>`;
    s += `Incorrect guesses: ${incorrect}<br>`;
    s += `Total guesses: ${guesses}`;
    if (hasWon()) {
        s += '<br>Congratulations! You won!';
        divGuessing.hidden = true;
    }
    preCurState.innerHTML = s;
}

// ----------EVENT HANDLING----------

// Checks for when user presses enter to guess a character
function txtGuessKeyPressed(event) {
    if (event.charCode == 13) { // enter key
        guess();
    }
}

// Called by btnGuess to guess a character
function guess() {
    let c = txtGuess.value;
    guessChar(c);
    updateState();
    txtGuess.value = '';
    txtGuess.focus();
}

// ----------END EVENT HANDLING----------


initAnswers();
