import { startGame } from './startGame.js'

function guestUserEvent() {
  const $guestUserButton = document.querySelector('#guest-user');
  $guestUserButton.addEventListener('click', startGame)
}

export { guestUserEvent }