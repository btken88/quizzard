function startGameEvent() {
  const $startGameButton = document.querySelector('#start-game');
  $startGameButton.addEventListener('click', startGame);
}

function startGame(event) {
  const $gameSection = document.querySelector('#game');
  event.path[2].style.display = "none";
  $gameSection.style.display = "flex";
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
    return {
      question: question.question,
      choices: [...question.incorrect_answers, question.correct_answer],
      correctAnswer: question.correct_answer
    }
  })
}

function renderGame(questions) {
  console.log(questions)
}


// function renderQuestionCard

export { startGameEvent, startGame };