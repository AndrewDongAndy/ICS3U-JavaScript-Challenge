/*
Andy Dong
Mr. Cutten
ICS 3U
December 21, 2018

Javascript Programming Challenge

A program that allows the user to play Hangman.
*/


// ----------STATIC----------

const MAX_ANS_LEN = 30; // longest answer allowed
const MAX_INCORRECT = 6; // number of incorrect guesses allowed

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

// Update the number of incorrect guesses allowed
function updateIncorrectGuesses() {
    liIncorrectGuesses.innerHTML = `Try to guess the answer; once you get `
        + `${MAX_INCORRECT} incorrect guesses, you lose!`;
}

// Returns a normalized string (all uppercase with single spaces
// between words), leading or trailing spaces removed
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

// ----------END STATIC----------


// ----------GAME DATA----------

var guesses; // number of guesses the user has taken
var incorrect; // guesses which were not characters in the answer
var answer; // answer for the round
var len; // length of answer (for easier reference)

var charGuessed; // whether each character has been guessed
var charLocations; // locations of each letter; 2D array
var curState; // current state of the game

// ----------END GAME DATA----------



// ----------UTILITY FUNCTIONS----------

// Sets the answer to the current game and its length.
// answer should only contain alphabetic characters
// (case insensitive)
// ABSOLUTELY CANNOT CONTAIN UNDERSCORES
function setAnswer(ans) {
    // assuming ans is normalized
    console.assert(isValidAnswer(ans), 'invalid answer!!!');
    answer = ans;
    len = answer.length;
    // initializing data required for game
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
        let cId = answer.charCodeAt(i) - ID_A; // position in alphabet
        charLocations[cId].push(i);
    }
    // the game state
    curState = new Array(len);
    // for each character, if it is not a space, show a '_'
    for (let i = 0; i < len; i++) {
        curState[i] = (answer[i] == ' ' ? ' ' : '_');
    }
}

// Sets a random answer for a new game.
function setRandomAnswer() {
    setAnswer(answers[randInt(0, answers.length - 1)]);
}

// Returns whether a string is a valid answer string:
// each character must be alphabetic or a space.
function isValidAnswer(s) {
    // must be between 1 and 30 characters, inclusive
    if (s.length == 0 || s.length > MAX_ANS_LEN) return false;
    for (let i = 0; i < s.length; i++) {
        let c = s.charAt(i);
        if (!isAlpha(c) && c != ' ') return false;
    }
    return true;
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
function userHasWon() {
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
        'censorship',
        'well played',
        'good game',
        'uncommon'
    ];
    // normalize all answers
    for (let i = 0; i < answers.length; i++) {
        answers[i] = normalized(answers[i]);
    }
    // assumption that all file strings are valid: alphabetic and nonempty
    // TODO: use file input/output?
    // http://qnimate.com/javascript-create-file-object-from-url/
}

// Shows the game elements in preparation for the start of a new round.
function showGameElements() {
    endWinAnimation();
    updateState();
    clearCanvas();
    resetHook();
    divGuessing.hidden = false;
    preCurState.hidden = false;
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
    // at this point, the set answer must be valid
    setAnswer(ans);
    showGameElements();
    txtGuess.focus();
    alert(`Success! Answer set as: ${answer}`);
}

// ----------END GAME INITIALIZATION----------


// ----------USER INTERACTION----------

// Updates the state of the game displayed to the user.
// This includes letters/underscores, guesses used,
// incorrect guesses, and whether user has won.
function updateState() {
    preCurState.innerHTML = getCurState() + '<br><br>';
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
    if (userHasWon()) {
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

// Called by txtGuessKeyPressed to guess a character
function userGuessed() {
    // get guess and immediately clear and focus text field
    let c = txtGuess.value.toUpperCase();
    txtGuess.value = '';
    txtGuess.focus();
    // validate input
    if (c.length != 1 || !isAlpha(c)) {
        alert('Invalid guess; please enter an alphabetic character.');
        return;
    }
    // check if this character has been guessed before
    let cId = c.charCodeAt(0) - ID_A; // position in alphabet of c
    if (charGuessed[cId]) {
        alert(`You have already guessed ${c}... try again!`);
        return;
    }
    // at this point, input is valid and not previously guessed
    guesses++;
    charGuessed[cId] = true;
    // show this character where it appears in the answer
    charLocations[cId].forEach(function(i) {
        curState[i] = c;
    });
    // if there are no locations with the given character, then
    // the guess was incorrect
    if (charLocations[cId].length == 0) {
        incorrect++;
        updateHook(incorrect);
    }
    updateState();
}

// ----------END EVENT HANDLING----------


// call the below methods when page loads
updateIncorrectGuesses();
initAnswers();
