/*
HTML elements for easier reference in code; note that this is
the first script to be run in the index.html file.
*/

var btnGuess = document.getElementById('btn-guess');
var btnNewGame = document.getElementById('btn-new-game');
var canvHangman = document.getElementById('canv-hangman');
var ctx = canvHangman.getContext('2d');
var divGuessing = document.getElementById('div-guessing');
var divStartGame = document.getElementById('div-start-game');
var preCurState = document.getElementById('pre-cur-state');
var txtGuess = document.getElementById('txt-guess');