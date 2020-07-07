function startGameEvent() {
  const $startGameButton = document.querySelector('#start-game');
  $startGameButton.addEventListener('click', startGame);
}

function startGame(event) {
  console.log('Start game button clicked')
}

export { startGameEvent };