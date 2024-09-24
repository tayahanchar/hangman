import { questions } from "./data.js";

const letters = [['A'], ['B'], ['C'], ['D'], ['E'], ['F'], ['G'], ['H'], ['I'], ['J'], ['K'], ['L'], ['M'], ['N'], ['O'], ['P'], ['Q'], ['R'], ['S'], ['T'], ['U'], ['V'], ['W'], ['X'], ['Y'], ['Z']];

let word;
let loseCounter = 0;
let rightLettersCounter = 0;
let questionNumber;

gameInit(questions);

function gameInit(questionsArray) {
  questionNumber = getRandomNumber(0, questionsArray.length);
  word = questionsArray[questionNumber][1].toUpperCase();

  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');

  const header = document.createElement('header');
  const headerText = document.createElement('h1');
  headerText.textContent = 'Hangman';

  const main = document.createElement('main');
  main.classList.add('main');

  const sectionLeft = document.createElement('section');
  sectionLeft.classList.add('left');

  const gallows = document.createElement('img');
  gallows.classList.add('gallows-img');
  gallows.alt = 'gallows';
  gallows.src = './images/gallows.png';

  const counter = document.createElement('div');
  counter.classList.add('counter');
  counter.innerHTML = 'Incorrect guesses: ';

  const countNumber = document.createElement('span');
  countNumber.classList.add('count-number');
  countNumber.textContent = 0;

  const slash = document.createTextNode(' / ');

  const numberOfAttempts = document.createElement('span');
  numberOfAttempts.textContent = 6;

  const sectionRight = document.createElement('section');
  sectionRight.classList.add('right');

  const wordDOM = document.createElement('div');
  wordDOM.classList.add('word');

  const hint = document.createElement('p');
  hint.classList.add('hint');
  hint.textContent = questionsArray[questionNumber][0];

  const keyboard = document.createElement('div');
  keyboard.classList.add('keyboard');

  document.body.prepend(wrapper);
  wrapper.append(header);
  header.append(headerText);
  wrapper.append(main);
  main.prepend(sectionLeft);
  sectionLeft.prepend(gallows);
  sectionLeft.append(counter);
  main.append(sectionRight);
  sectionRight.prepend(wordDOM);
  sectionRight.append(hint);
  sectionRight.append(keyboard);
  counter.append(countNumber);
  counter.append(slash);
  counter.append(numberOfAttempts);

  createandShowEmptyLetters(questionsArray[questionNumber][1]);
  createAndShowKeyBoard();

  keyboard.addEventListener('click', checkLetterfromVirtualKeyboard);
  document.addEventListener('keydown', checkLetterfromKeyboard);
};

function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function createandShowEmptyLetters(phrase) {
  for (let index = 0; index < phrase.length; index++) {
    const letter = document.createElement('div');
    letter.setAttribute('data-letter', `letter${index}`);
    letter.classList.add('letter');
    if(phrase[index] === ' ') {
      letter.classList.add('letter-empty')
    }

    if(phrase[index] === ' ') rightLettersCounter++;
    document.querySelector('.word').append(letter);
  }
}

function createAndShowKeyBoard() {
  for (let index = 0; index < letters.length; index++) {
    const key = document.createElement('div');
    key.classList.add('key');
    key.setAttribute('data-key', letters[index]);
    key.textContent = letters[index];
    document.querySelector('.keyboard').append(key);
  }
}

function checkLetterfromVirtualKeyboard(event) {
  if(!event.target.classList.contains('key')) return;

  let isLetterTrue = false;

  for (let index = 0; index < word.length; index++) {
    if(word[index] === event.target.textContent) {
      document.querySelector(`[data-letter=letter${index}]`).textContent = event.target.textContent;
      document.querySelector(`[data-letter=letter${index}]`).style.borderBottom = 'none';
      isLetterTrue = true;
      rightLettersCounter++;
      if(rightLettersCounter === word.length) showModalWindow('You win', loseCounter, word);
    }
  }

  if(isLetterTrue) {
    event.target.classList.add('key-true');
  } else {
    event.target.classList.add('key-false');
    loseCounter++;
    document.querySelector('.count-number').textContent = loseCounter;
    document.querySelector('.gallows-img').src = `./images/gallows${loseCounter}.png`;
    if(loseCounter === 6) {
      showModalWindow('You lose', loseCounter, word); 
    }
  }

  event.target.classList.remove('key');
}

function checkLetterfromKeyboard(event) {
  if(event.code.slice(0, 3) !== 'Key') return;

  const currentKey = event.code[3];
  const currentDomLetter = document.querySelector(`[data-key=${currentKey}]`);

  if(!letters.flat().includes(currentKey)) return;
  if(currentDomLetter.classList.contains('key-true')) return;
  if(currentDomLetter.classList.contains('key-false')) return;

  let isLetterTrue = false;

  for (let index = 0; index < word.length; index++) {
    if(word[index] === currentKey) {
      document.querySelector(`[data-letter=letter${index}]`).textContent = currentKey;
      document.querySelector(`[data-letter=letter${index}]`).style.borderBottom = 'none';
      isLetterTrue = true;
      rightLettersCounter++;
      if(rightLettersCounter === word.length) showModalWindow('You win', loseCounter, word);
    }
  }

  if(isLetterTrue) {
    currentDomLetter.classList.add('key-true');
  } else {
    currentDomLetter.classList.add('key-false');
    loseCounter++;
    document.querySelector('.count-number').textContent = loseCounter;
    document.querySelector('.gallows-img').src = `./images/gallows${loseCounter}.png`;
    if(loseCounter === 6) {
      showModalWindow('You lose', loseCounter, word); 
    }
  }

  currentDomLetter.classList.remove('key');
}

function showModalWindow(message, count, word) {
  const modal = document.createElement('div');
  modal.classList.add('modal');

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal__content');

  const modalText = document.createElement('p');
  modalText.classList.add('modal__text');
  modalText.textContent = `${message} (${count}/6)!!!`;

  const modalWord = document.createElement('p');
  modalWord.classList.add('modal__word');
  modalWord.textContent = word;

  const button = document.createElement('button');
  button.classList.add('new-game-button');
  button.textContent = 'Play again';

  document.body.prepend(modal);
  modal.append(modalContent);
  modalContent.append(modalText);
  modalContent.append(modalWord);
  modalContent.append(button);

  document.querySelector('.keyboard').removeEventListener('click', checkLetterfromVirtualKeyboard);
  document.removeEventListener('keydown', checkLetterfromKeyboard);

  button.addEventListener('click', startNewGame);
}

function startNewGame() {
  loseCounter = 0;
  rightLettersCounter = 0;

  const lastQuestionNumber = questionNumber;

  while(lastQuestionNumber === questionNumber) {
    questionNumber = getRandomNumber(0, questions.length);
  }

  word = questions[questionNumber][1].toUpperCase();

  document.querySelector('.gallows-img').src = `./images/gallows.png`;
  document.querySelector('.count-number').textContent = loseCounter;

  document.querySelector('.word').innerHTML = '';
  createandShowEmptyLetters(questions[questionNumber][1]);

  document.querySelectorAll('.key-false').forEach(item => item.className = 'key');
  document.querySelectorAll('.key-true').forEach(item => item.className = 'key');

  document.querySelector('.hint').textContent = questions[questionNumber][0];
  document.querySelector('.modal').remove();

  document.querySelector('.keyboard').addEventListener('click', checkLetterfromVirtualKeyboard);
  document.addEventListener('keydown', checkLetterfromKeyboard);
}