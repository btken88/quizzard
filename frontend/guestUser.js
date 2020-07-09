import { showCategories } from './startGame.js'

function guestUserEvent() {
  const $guestUserButton = document.querySelector('#guest-user');
  $guestUserButton.addEventListener('click', showCategories)
}

export { guestUserEvent }