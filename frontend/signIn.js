function signInEvent() {
  const $signInButton = document.querySelector('#sign-in');
  $signInButton.addEventListener('click', signIn)
}

function signIn(event) {
  alert('Account feature coming soon!')
}

export { signInEvent }