# Quizard

A vanilla JavaScript, Single Page Web App that lets you test your knowledge in a range of subjects.

## Table of Contents

- [Quizard](#quizard)
  - [Table of Contents](#table-of-contents)
  - [General Info](#general-info)
  - [Inspiration](#inspiration)
  - [Demonstration Video](#demonstration-video)
  - [Technologies](#technologies)
  - [Setup](#setup)
  - [Example Code](#example-code)
  - [Features](#features)
  - [Status](#status)
  - [Contact](#contact)
  - [License](#license)

## General Info

Quizard is a single page JavaScript web app which allows users to play a quiz game, create and login to accounts, and save quiz scores to compare scores on different quizzes.

## Inspiration

Quizard was created as a sample project to explore designing vanilla JavaScript single page apps while integrating outside APIs for data in addition to a backend with auth and user permissions.

## Demonstration Video

[Quizard Youtube Demonstation](https://youtu.be/335Ts0zUaas)

## Technologies

- Ruby on Rails
- ActiveRecord
- JavaScript
- Sqlite3
- bcrypt
- JWT
- HTML
- SCSS

## Setup

To get Quizard installed and running, first clone the Github Repository into your directory and navigate to the backend folder to install the required gems and get the database set up:

```bash
cd backend
bundle install
rails db:migrate
```

Then start up the rails server - notice that the app is setup to run the backend on port 3001:

```bash
rails s -p 3001
```

To get the front end running, navigate into the frontend folder and run your server (I'm using lite-server)

```bash
~frontend lite-server
```

## Example Code

```ruby
  def login
    @user = User.find_by username: params[:username]

    if !@user
      render json: { error: 'Authentication failed.' }, status: :unauthorized
    else
      if !@user.authenticate params[:password]
        render json: { error: 'Authentication failed!' }, status: :unauthorized
      else
        payload = { user_id: @user.id }
        secret = Rails.application.secret_key_base
        token = JWT.encode payload, secret
        render json: { token: token, user: @user }
      end
    end
  end

  def authorize
    header = request.headers['Authorization']
    puts request.headers['Authorization']
    token = header.split(' ')[1]
    if !token
      render json: { error: 'User not authorized' }, status: :forbidden
    else
      begin
        secret = Rails.application.secret_key_base
        payload = JWT.decode(token, secret)[0]
        @user = User.find payload['user_id']
      rescue StandardError
        render json: { error: 'User not authorized' }, status: :forbidden unless @user
      end
    end
  end
```

```javascript
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

funtion UserLogin(event) {
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
    .then(handleResponse)
    .catch(errorAlert);
}

function handleResponse(response) {
  if (response.error) {
    alert(`Error! ${response.error}`)
  } else {
    grantUserAccess(response.token)
    storeUserData(response.user)
  }
}
```

## Features

Current Features:

- Play as a guest user or create an account to keep coming back
- Full auth
- Select specific categories to quiz yourself on
- Save scores to your user account

Future Features:

- Timer to track how long your quiz took
- Add more categories to be quizzed on
- Create a leaderboard with public high scores
- Ability to choose how many questions appear on the quiz

## Status

The application is fully functional and ready to be enjoyed as is. Future updates and improvements are still a possibility.

## Contact

Created by [Bryce Kennedy](https://www.linkedin.com/in/bryce-kennedy/)

If you have any questions or comments feel free to reach out to me and thank you for your time.

## License

[Click to view](https://github.com/btken88/quizard/blob/master/LICENSE)
