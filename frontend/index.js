const db = {
  users: "http://localhost:3001/users",
  login: "http://localhost:3001/login",
  games: "http://localhost:3001/games"
}
const $ = {
  welcomeScreen: document.querySelector('#welcome-screen'),
  accountSection: document.querySelector('#account-section'),
  gameSection: document.querySelector('#game'),
  gameEndSection: document.querySelector('#game-end'),
  userSection: document.querySelector('#user-page'),
  startGameButton: document.querySelector('.start-game'),
  login: document.querySelector('#login'),
  createAccount: document.querySelector('#create-account'),
  categoriesDiv: document.querySelector('.select-category'),
  selectedCategory: document.querySelector('#categories'),
  submitCategory: document.querySelector('.submit-category'),
  answerTotal: document.querySelector('.total'),
  questionCard: document.querySelector('.question-card'),
  question: document.querySelector('.question-card p'),
  options: document.querySelector('.options'),
  nextButton: document.querySelector('.next'),
  signInButton: document.querySelector('#sign-in'),
  gameEndContent: document.querySelector('#game-end-content'),
  restartButton: document.querySelector('#restart'),
  saveScore: document.querySelector('#save-score'),
  userInfo: document.querySelector('.user-info'),
  username: document.querySelector('.username'),
  games: document.querySelector('.games')
}

let token = localStorage.getItem("token");

let totalCorrect, shuffledQuestions, currentQuestionIndex, user, categoryText;

$.login.addEventListener('submit', userLogin)

$.createAccount.addEventListener('submit', createAccount)

$.submitCategory.addEventListener('click', playGame)

$.nextButton.addEventListener('click', () => {
  currentQuestionIndex += 1;
  setNextQuestion();
})

$.restartButton.addEventListener('click', showCategories);

$.saveScore.addEventListener('click', saveScore)

function getUser() {
  if (token) {
    fetch(db.users, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }).then(renderJSON)
      .then(storeUserData)
  }
}

function signInEvent() {
  $.signInButton.addEventListener('click', signIn);
}

function signIn() {
  $.welcomeScreen.style.display = "none";
  $.accountSection.style.display = "flex";
}

function guestUserEvent() {
  $.startGameButton.addEventListener('click', showCategories);
}

function userLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const username = formData.get('username');
  const password = formData.get('password');
  const user = {
    username,
    password
  };
  fetch(db.login, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  }).then(renderJSON)
    .then(response => {
      grantUserAccess(response.token)
      storeUserData(response.user)
    })
    .catch(errorAlert);
}

function grantUserAccess(token) {
  localStorage.setItem("token", token);
  $.accountSection.style.display = "none";
  showCategories();
}

function storeUserData(userData) {
  user = userData
}

function createAccount(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const username = formData.get('username');
  const password = formData.get('password');
  const user = {
    username,
    password
  }
  fetch(db.users, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  }).then(renderJSON)
    .then(response => {
      successfulCreation(response);
      event.target.reset()
    })
    .catch(errorAlert);
}

function successfulCreation() {
  const $creationMessage = document.createElement('p');
  $creationMessage.textContent = 'Account Created. Login above!'
  $.createAccount.append($creationMessage)
}

function errorAlert(error) {
  alert("Error!", error.message)
}

function showCategories() {
  $.questionCard.style.display = "none"
  $.gameEndSection.style.display = "none";
  $.gameSection.style.display = "flex"
  $.categoriesDiv.style.display = "flex";
  $.answerTotal.textContent = "0";
  $.welcomeScreen.style.display = "none";
  $.userSection.style.display = "none";
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
  categoryText = $.selectedCategory.selectedOptions[0].textContent;
  token = localStorage.getItem("token");
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

function endGame(score) {
  if (token) {
    $.saveScore.style.display = "block";
    getUser()
  }
  $.gameSection.style.display = "none"
  $.gameEndSection.style.display = "flex"
  $.gameEndContent.textContent = `You scored ${score}/10!`
}

function saveScore() {
  $.gameEndSection.style.display = 'none';
  showScores()
  fetch(db.games, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ score: totalCorrect })
  }).then(renderJSON)
    .catch(errorAlert)
}

function showScores() {
  $.games.innerHTML = ''
  $.userSection.style.display = 'flex';
  $.username.textContent = `Welcome Back ${user.username}!`;
  user.games.forEach(game => {
    const date = game.created_at.split('T')[0]
    const $li = document.createElement('li');
    $li.textContent = `Score: ${game.score} Date: ${date}`
    $.games.append($li);
  })
  const $li = document.createElement('li');
  $li.textContent = `Score: ${totalCorrect} Category: ${categoryText} Date: ${currentDate()}`
  $.games.append($li)
}

function currentDate() {
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return `${yyyy}-${mm}-${dd}`
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

signInEvent()
guestUserEvent()