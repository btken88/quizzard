function signInEvent() {
  const $signInButton = document.querySelector('#sign-in');
  $signInButton.addEventListener('click', signIn)
}

function signIn(event) {
  console.log('Account feature coming soon!')
}

export { signInEvent }