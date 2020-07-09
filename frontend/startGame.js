import { endGame } from './endGame.js'

const $ = {
  welcomeScreen: document.querySelector('#welcome-screen'),
  restartButton: document.querySelector('#restart'),
  gameSection: document.querySelector('#game'),
  options: document.querySelector('.options'),
  questionCard: document.querySelector('.question-card'),
  question: document.querySelector('.question-card p'),
  nextButton: document.querySelector('.next'),
  answerTotal: document.querySelector('.total'),
  startButton: document.querySelector('.submit-category'),
  categoriesDiv: document.querySelector('.select-category'),
  selectedCategory: document.querySelector('#categories'),
  gameEndSection: document.querySelector('#game-end')
}

let totalCorrect, shuffledQuestions, currentQuestionIndex;

$.startButton.addEventListener('click', playGame)

$.nextButton.addEventListener('click', () => {
  currentQuestionIndex += 1;
  setNextQuestion()
})

$.restartButton.addEventListener('click', showCategories)

function showCategories() {
  $.questionCard.style.display = "none"
  $.gameEndSection.style.display = "none";
  $.gameSection.style.display = "flex"
  $.categoriesDiv.style.display = "flex";
  $.answerTotal.textContent = "0";
  $.welcomeScreen.style.display = "none";
  totalCorrect = 0;
  resetState()
}

function startGame(event) {
  $.questionCard.style.display = "none";
  $.gameSection.style.display = "flex";
  $.answerTotal.textContent = "0";
  totalCorrect = 0;
}


function playGame() {
  $.categoriesDiv.style.display = "none";
  $.questionCard.style.display = "block";
  fetch(`https://opentdb.com/api.php?amount=10&category=${$.selectedCategory.value}`)
    .then(renderJSON)
    .then(data => formatData(data.results))
    .then(renderGame)
}

function renderJSON(response) {
  return response.json();
}

function formatData(questions) {
  return questions.map(question => {
    const options = [...question.incorrect_answers, question.correct_answer];
    const shuffledOptions = scrambleOptions(options);
    return {
      question: question.question,
      options: shuffledOptions,
      correctAnswer: question.correct_answer
    };
  });
}

function renderGame(questions) {
  shuffledQuestions = scrambleOptions(questions);
  currentQuestionIndex = 0;
  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function resetState() {
  $.nextButton.classList.add('hidden');
  $.question.textContent = "Question";
  $.options.innerHTML = '';
}

function showQuestion(question) {
  $.question.textContent = decodeHTML(question.question);
  $.question.parentElement.setAttribute('data-correct-answer', question.correctAnswer);
  renderOptions(question.options);
}

function renderOptions(options) {
  options.forEach(option => {
    const $item = document.createElement('button');
    $item.textContent = decodeHTML(option);
    $item.addEventListener('click', selectAnswer)
    $.options.append($item);
  });
}

function selectAnswer(event) {
  const correctAnswer = event.target.parentNode.parentNode.getAttribute('data-correct-answer');
  if (event.target.textContent === correctAnswer) {
    totalCorrect += 1;
    $.answerTotal.textContent = totalCorrect;
    event.target.style.backgroundColor = "#3fa649";
  } else {
    event.target.style.backgroundColor = "#e63743";
  }
  if (currentQuestionIndex < shuffledQuestions.length - 1) {
    $.nextButton.classList.remove('hidden');
  } else {
    setTimeout(function () { endGame(totalCorrect) }, 1000);
  }
}

// Decodes HTML entities and returns string with characters
function decodeHTML(html) {
  let $textarea = document.createElement('textarea');
  $textarea.innerHTML = html;
  return $textarea.value;
}

// Scrambles elements of an array
function scrambleOptions(options) {
  return options.sort(() => Math.random() - .5)
}


export { startGame, showCategories };