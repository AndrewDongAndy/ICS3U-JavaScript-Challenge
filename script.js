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
const MAX_INCORRECT = 6; // most incorrect guesses allowed

var answers; // master array of all possible answers

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
    // initailizing data required for game
    // if char was guessed
    charGuessed = new Array(26);
    charGuessed.fill(false, 0, 26);
    // locations of each character
    charLocations = new Array(26);
    for (let i = 0; i < 26; i++) {
        charLocations[i] = [];
    }
    for (let i = 0; i < len; i++) {
        if (answer.charAt(i) == ' ') continue; // ignore spaces
        let v = answer.charCodeAt(i) - ID_A; // position in alphabet
        charLocations[v].push(i);
    }
    // the game state
    curState = new Array(len);
    // for each character, if it is not a space, show a '_'
    for (let i = 0; i < len; i++) {
        curState[i] = (answer[i] == ' ' ? ' ' : '_');
    }
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
    let s = '';
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

// Loads all answers into the answers array.
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
initAnswers(); // call when page loads

// Shows the game elements in preparation for the start
// of a new round
function showGameElements() {
    endWinAnimation();
    updateState();
    updateHook(incorrect);
    divGuessing.hidden = false;
    canvHangman.hidden = false;
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
    let ans = prompt('Enter an answer string; alphabetic characters only, '
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
    preCurState.innerHTML = `${getCurState()}<br><br>`;
    preCurState.innerHTML += `Incorrect guesses: ${incorrect}<br>`;
    preCurState.innerHTML += `Total guesses: ${guesses}<br>`;
    if (guesses != 0) {
        preCurState.innerHTML += 'Letters guessed: ';
        for (let i = 0; i < 26; i++) {
            if (charGuessed[i]) {
                preCurState.innerHTML += String.fromCharCode(ID_A + i) + ' ';
            }
        }
    }
    // handle winning
    if (hasWon()) {
        preCurState.innerHTML += '<br>Congratulations! You won!';
        divGuessing.hidden = true;
        startWinAnimation();
    }
    else if (incorrect == MAX_INCORRECT) {
        preCurState.innerHTML += '<br>You lost!<br>';
        preCurState.innerHTML += `The answer was ${answer}.`;
        divGuessing.hidden = true;
        startLoseAnimation();
    }
}

// ----------EVENT HANDLING----------

// Checks for when user presses enter to guess a character
function txtGuessKeyPressed(event) {
    if (event.charCode == 13) { // code of enter key
        userGuessed();
    }
}

// Called by btnGuess to guess a character
function userGuessed() {
    let c = txtGuess.value;
    if (!isGuessValid(c)) return;
    c = c.toUpperCase();
    let v = c.charCodeAt(0) - ID_A;
    charGuessed[v] = true;
    // show this character where it appears in the answer
    charLocations[v].forEach(function(i) {
        curState[i] = c;
    });
    guesses++;
    if (charLocations[v].length == 0) {
        incorrect++;
        updateHook(incorrect);
    }
    updateState();
    txtGuess.value = '';
    txtGuess.focus();
}

// ----------END EVENT HANDLING----------
