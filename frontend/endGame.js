const $endGameContent = document.querySelector('#game-end-content')
const $gameEndSection = document.querySelector('#game-end')
const $gameSection = document.querySelector('#game')

function endGame(score) {
  $gameSection.style.display = "none"
  $gameEndSection.style.display = "flex"
  $endGameContent.textContent = `You scored ${score}/10!`
}

export { endGame }