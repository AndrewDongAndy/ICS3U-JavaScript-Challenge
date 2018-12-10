/*
The main container for all methods called by HTML events.

Commented using JSDoc.
*/


// ----------STATIC----------

var answers; // master array of all possible answers

// Game parameters
const MAX_ANS_LEN = 35;     // longest answer allowed
const MAX_INCORRECT = 6;    // number of incorrect guesses allowed

// Character IDs
const ID_ENTER = 13;        // character code of enter key
const ID_A = 65;            // ASCII id for the character 'A'

/**
 * Returns whether or not the given character is alphabetic.
 *
 * @param {char} c the character to check
 * @return {boolean} whether the given character is alphabetic
 */
function isAlpha(c) {
  return c.toLowerCase() != c.toUpperCase();
}

/**
 * Returns a random integer in the range [a, b].
 * Used to select a random word for a regular game.
 *
 * @param {number} a the lower bound of the range
 * @param {number} b the upper bound of the range
 * @return {?number} a random integer between a and b, inclusive
 */
function randInt(a, b) {
  // NOTE: above, ?number means returns number OR null
  if (a > b) {
    console.error(`invalid arguments: randInt(${a}, ${b})`);
    return null;
  }
  return a + Math.floor(Math.random() * (b - a + 1));
}


/**
 * Updates the number of incorrect guesses before losing.
 * Shown in the "How to play" section of the webpage.
 */
function updateLiIncorrectGuesses() {
  liIncorrectGuesses.innerHTML = 'Once you get ' + MAX_INCORRECT +
      ' incorrect guesses, you lose!';
}


/**
 * Returns a normalized string: all uppercase with single spaces
 * between words and leading or trailing spaces removed.
 *
 * @param {string} s string to normalize
 * @return {string} normalized string
 */
function normalized(s) {
  s = s.trim().toUpperCase();
  let res = '';
  // remove extra whitespace within string (e.g. collapse spaces)
  for (let c of s) {
    // below: works due to short-circuiting of || operator
    if (c != ' ' || res.charAt(res.length - 1) != ' ') {
      res += c;
    }
  }
  return res;
}

// ----------END STATIC----------


// ----------GAME DATA----------

var guesses;            // number of guesses the user has taken
var incorrect;          // guesses which were not characters in the answer
var answer;             // answer for the round
var len;                // length of answer

// arrays
var charGuessed;        // whether each character has been guessed
var charLocations;      // locations of each letter; 2D array
var curState;           // current state of the game

// ----------END GAME DATA----------


// ----------UTILITY FUNCTIONS----------


/**
 * Sets the answer of the current game with all of the helper
 * values: len, charGuessed, charLocations, and curState.
 * ans is assumed to be valid and normalized.
 *
 * @param {string} ans the string to set as the answer
 */
function setAnswer(ans) {
  answer = ans;
  len = answer.length;
  charGuessed = new Array(26);
  charGuessed.fill(false, 0, 26);
  // store locations of each character: charLocations[i] contains all
  // locations where the ith letter (0-indexed) of the alphabet appears
  charLocations = new Array(26);
  for (let i = 0; i < 26; i++) {
    charLocations[i] = [];
  }
  for (let i = 0; i < len; i++) {
    if (answer.charAt(i) != ' ') {
      let cId = answer.charCodeAt(i) - ID_A;
      charLocations[cId].push(i);
    }
  }
  // initialize current game state:
  // for each character, if it is not a space, show an underscore
  curState = new Array(len);
  for (let i = 0; i < len; i++) {
    curState[i] = (answer[i] == ' ' ? ' ' : '_');
  }
}

/**
 * Sets a random answer for a new game.
 */
function setRandomAnswer() {
  setAnswer(answers[randInt(0, answers.length - 1)]);
}

/**
 * Returns whether a string is a valid answer string. In a valid answer
 * string, each character must be an uppercase letter or a space.
 * Includes debugging statements via console.warn() to show reason
 * a given string is invalid.
 *
 * @param {string} s the string to validate
 * @return {boolean} whether the string is a valid answer string
 */
function isValidAnswer(s) {
  // must be between 1 and MAX_ANS_LEN characters, inclusive
  if (s.length == 0) {
    console.warn('invalid answer: empty string');
    return false;
  }
  if (s.length > MAX_ANS_LEN) {
    console.warn(`invalid answer (too long): ${s}`);
    return false;
  }
  for (let i = 0; i < s.length; i++) {
    let c = s.charAt(i);
    if (c != c.toUpperCase()) {
      console.warn(`invalid answer (not all uppercase): ${s}`);
      return false;
    }
    if (!isAlpha(c) && c != ' ') {
      console.warn(`invalid answer (not alphabetic): ${s}`);
      return false;
    }
  }
  return true;
}

/**
 * Returns current state of game (for display only)
 *
 * @return {string} the game state for display
 */
function getCurState() {
  let s = '';
  for (let i = 0; i < len; i++) {
    if (curState[i] == ' ') {
      s += '  '; // exaggerate spaces
    } else {
      s += curState[i];
    }
    if (i != len - 1) {
      s += ' ';
    }
  }
  return s;
}

/**
 * Returns whether user has won the game: the user has won if and
 * only if the current game state does not contain any underscores.
 *
 * @return {boolean} whether user has won
 */
function hasWon() {
  for (let i = 0; i < len; i++) {
    if (curState[i] == '_') {
      return false;
    }
  }
  return true;
}

/**
 * Returns whether user has lost the game: the user has lost if and
 * only of they have reached the maximum number of incorrect
 * guesses allowed.
 *
 * @return {boolean} whether user has lost
 */
function hasLost() {
  return incorrect == MAX_INCORRECT;
}

// ----------END UTILITY FUNCTIONS----------


// ----------GAME INITIALIZATION----------


/**
 * Loads all valid answers from the makeshift text file "word_list.js"
 * into the answers array. Normalizes the valid answers and eliminates
 * the invalid answers.
 */
function initAnswers() {
  let tmp = word_list.split('\n'); // lines of makeshift text file
  answers = [];
  for (let i = 0; i < tmp.length; i++) {
    let a = tmp[i];
    let na = normalized(a);
    if (na.length == 0) {
      continue; // skip lines which only contain whitespace
    }
    if (isValidAnswer(na)) {
      answers.push(na);
    } else {
      // invalid answer: show warning in console, and display
      // original value (not normalized value).
      // serves only as a debugging mechanism
      console.warn(`invalid answer excluded: "${a}"`);
    }
  }
}

/**
 * Prepares the game elements for a new round; displays and clears values.
 */
function initGameElements() {
  endAnimation();
  updateState();
  clearCanvas();
  resetHook();
  divGuessing.hidden = false;
  preCurState.hidden = false;
  canvHangman.hidden = false;
  txtGuess.value = '';
  txtSolve.value = '';
  txtGuess.focus();
}

/**
 * Called when user clicks btnNewGame.
 */
function newGame() {
  guesses = 0;
  incorrect = 0;
  setRandomAnswer();
  initGameElements();
}

/**
 * Called when user clicks btnCustomGame.
 */
function customGame() {
  guesses = 0;
  incorrect = 0;
  let ans = prompt('Enter an answer string; alphabetic characters only, ' +
      `maximum ${MAX_ANS_LEN} characters.`);
  if (ans == null) {
    return; // user cancelled the prompt
  }
  ans = normalized(ans);
  if (!isValidAnswer(ans)) {
    alert('Sorry, that is not a valid answer string.');
    return;
  }
  // at this point, the given answer string must be valid
  setAnswer(ans);
  initGameElements();
  alert(`Success! Answer set as: ${answer}`);
}

// ----------END GAME INITIALIZATION----------


// ----------USER INTERACTION----------


/**
 * Updates the state of the game displayed to the user. This includes
 * leltters/underscores, guesses used, and incorrect guesses. Also
 * handles if user has won or lost.
 */
function updateState() {
  preCurState.innerHTML = getCurState() + '<br><br>';
  preCurState.innerHTML += `Incorrect guesses: ${incorrect}<br>`;
  preCurState.innerHTML += `Total guesses: ${guesses}<br>`;
  preCurState.innerHTML += 'Letters guessed:';
  let g = false; // whether user has guessed an individual character
  for (let i = 0; i < 26; i++) {
    if (charGuessed[i]) {
      g = true;
      preCurState.innerHTML += ' ' + String.fromCharCode(ID_A + i);
    }
  }
  // if no individual characters have been guessed, show 'none'
  if (!g) {
    preCurState.innerHTML += ' none';
  }
  // handle game end
  if (hasWon()) {
    preCurState.innerHTML += '<br><br>Congratulations! You won!';
    divGuessing.hidden = true;
    startWinAnimation();
  } else if (hasLost()) {
    preCurState.innerHTML += '<br><br>You lost!';
    preCurState.innerHTML += `<br>The answer was ${answer}.`;
    divGuessing.hidden = true;
    startLoseAnimation();
  } else {
    updateHook(incorrect);
  }
}

// ----------END USER INTERACTION----------


// ----------EVENT HANDLING----------

/**
 * Checks for when user presses enter to guess a character.
 *
 * @param {object} event the event of pressing a key
 */
function txtGuessKeyPressed(event) {
  if (event.charCode == ID_ENTER) {
    userGuessed();
  }
}

/**
 * Checks for when user presses enter to solve the puzzle.
 *
 * @param {object} event the event of pressing a key
 */
function txtSolveKeyPressed(event) {
  if (event.charCode == ID_ENTER) {
    userSolved();
  }
}

/**
 * Called by txtGuessKeyPressed to guess a character.
 * Handles bad input accordingly.
 */
function userGuessed() {
  // get guess and immediately clear and focus text field
  let c = txtGuess.value.toUpperCase();
  txtGuess.value = '';
  txtGuess.focus();
  // validate input
  if (c.length != 1 || !isAlpha(c)) {
    alert('Invalid guess: please enter an alphabetic character.');
    return;
  }
  // check if this character has been guessed before
  let cId = c.charCodeAt(0) - ID_A; // position in alphabet of c
  if (charGuessed[cId]) {
    alert(`You have already guessed ${c}. Try again!`);
    return;
  }
  // at this point, input is valid and not previously guessed
  guesses++;
  charGuessed[cId] = true;
  // show this character where it appears in the answer
  for (let i of charLocations[cId]) {
    curState[i] = c;
  }
  // if there are no locations with the given character, then
  // the guess was incorrect
  if (charLocations[cId].length == 0) {
    incorrect++;
  }
  updateState();
}

/**
 * Called by txtSolveKeyPressed to solve the puzzle.
 * Handles bad input accordingly.
 */
function userSolved() {
  let s = normalized(txtSolve.value);
  txtSolve.value = '';
  txtSolve.focus();
  // validate input
  if (!isValidAnswer(s)) {
    alert('Invalid guess: the answer is alphabetic and between 1 and ' +
        `${MAX_ANS_LEN} characters.`);
    return;
  }
  // at this point, guess must be valid
  guesses++;
  if (s == answer) {
    // guess is correct: show full answer
    for (let i = 0; i < len; i++) {
      curState[i] = answer.charAt(i);
    }
  } else {
    incorrect++;
  }
  updateState();
}

// ----------END EVENT HANDLING----------


// call the below methods when page loads
updateLiIncorrectGuesses();
initAnswers();
