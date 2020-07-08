import { endGame } from './endGame.js'

const $restartButton = document.querySelector('#restart')
const $gameSection = document.querySelector('#game');
const $options = document.querySelector('.options');
const $question = document.querySelector('.question-card p');
const $nextButton = document.querySelector('.next');
const $answerTotal = document.querySelector('.total');
let totalCorrect, shuffledQuestions, currentQuestionIndex;

$nextButton.addEventListener('click', () => {
  currentQuestionIndex += 1;
  setNextQuestion()
})
$restartButton.addEventListener('click', startGame)

function startGameEvent() {
  const $startGameButton = document.querySelector('#start-game');
  $startGameButton.addEventListener('click', startGame);
}

function startGame(event) {
  event.path[2].style.display = "none";
  $gameSection.style.display = "flex";
  $answerTotal.textContent = "0";
  totalCorrect = 0;
  playGame()
}

function playGame() {
  fetch('https://opentdb.com/api.php?amount=10&category=18')
    .then(renderJSON)
    .then(data => formatData(data.results))
    .then(renderGame)
}

function renderJSON(response) {
  return response.json();
}

function formatData(questions) {
  return questions.map(question => {
    const options = [...question.incorrect_answers, question.correct_answer]
    const shuffledOptions = options.sort(() => Math.random() - .5)
    return {
      question: question.question,
      options: shuffledOptions,
      correctAnswer: question.correct_answer
    };
  });
}

function renderGame(questions) {
  shuffledQuestions = questions.sort(() => Math.random() - .5)
  currentQuestionIndex = 0
  console.log(shuffledQuestions)
  setNextQuestion()
}

function setNextQuestion() {
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}

function resetState() {
  $nextButton.classList.add('hidden');
  $question.textContent = "Question";
  $options.innerHTML = ''
}

function showQuestion(question) {
  $question.textContent = decodeHTML(question.question)
  $question.parentElement.setAttribute('data-correct-answer', question.correctAnswer)
  renderOptions(question.options)
}

function renderOptions(options) {
  options.forEach(option => {
    const $item = document.createElement('button');
    $item.textContent = decodeHTML(option);
    $item.addEventListener('click', selectAnswer)
    $options.append($item);
  })
}

function selectAnswer(event) {
  const correctAnswer = event.target.parentNode.parentNode.getAttribute('data-correct-answer')
  if (event.target.textContent === correctAnswer) {
    totalCorrect += 1
    $answerTotal.textContent = totalCorrect
    event.target.style.backgroundColor = "#3fa649"
  } else {
    event.target.style.backgroundColor = "#e63743"
  }
  if (currentQuestionIndex < shuffledQuestions.length - 1) {
    $nextButton.classList.remove('hidden')
  } else {
    setTimeout(function () { endGame(totalCorrect) }, 1000)
  }
}

// Decodes HTML entities and returns string with characters
function decodeHTML(html) {
  let $textarea = document.createElement('textarea');
  $textarea.innerHTML = html;
  return $textarea.value
}


// function renderQuestionCard

export { startGameEvent, startGame };