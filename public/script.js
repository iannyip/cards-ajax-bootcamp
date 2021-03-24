// global value that holds info about the current hand.
let currentGame = null;

// Start page layout
const mainContainer = document.getElementById('game-container');
const createGameBtn = document.createElement('button');

// Game layout
const btnsContainer = document.createElement('div');
const refreshGameBtn = document.createElement('button');
const dealBtn = document.createElement('button');
const dealListDiv = document.createElement('div');

// For login page
const loginContainer = document.createElement('div');
const emailInput = document.createElement('input');
const passwordInput = document.createElement('input');
const submitBtn = document.createElement('button');


// DOM manipulation function that displays the player's current hand.
const runGame = function ({ playerHand }) {
  // manipulate DOM
  const gameContainer = document.querySelector('#game-container');

  gameContainer.innerText = `
    Your Hand:
    ====
    ${playerHand[0].name}
    of
    ${playerHand[0].suit}
    ====
    ${playerHand[1].name}
    of
    ${playerHand[1].suit}
    ====
  `;

  let winner;
  if (playerHand[0].rank > playerHand[1].rank){
    gameContainer.innerText += "card 1 won";
  } else if (playerHand[0].rank < playerHand[1].rank){
    gameContainer.innerText += 'card 2 won';
  } else {
    gameContainer.innerText += "it was a draw";
  }
};


const testFunction = async () => {
  axios.get('/test')
    .then(() => {
      console.log('test')
    })
    .catch(error => console.log(error));
}

// make a request to the server
// to change the deck. set 2 new cards into the player hand.
const dealCards = function () {
  axios.put(`/games/${currentGame.id}/deal`)
    .then((response) => {
      // get the updated hand value
      currentGame = response.data;

      // display it to the user
      runGame(currentGame);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

const createGame = function () {
  // Make a request to create a new game
  axios.post('/games')
    .then((response) => {
      // set the global value to the new game.
      currentGame = response.data;
      console.log(currentGame);

      // display it out to the user
      runGame(currentGame);

      // for this current game, create a button that will allow the user to
      // manipulate the deck that is on the DB.
      // Create a button for it.

      dealBtn.addEventListener('click', dealCards);

      // display the button
      dealBtn.innerText = 'Deal';
      document.body.appendChild(dealBtn);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

const renderGamePage = () => {
  mainContainer.innerHTML = '';
  btnsContainer.appendChild(refreshGameBtn);
  createGame();
}

const renderStartPage = () => {
  mainContainer.innerHTML = '';
  createGameBtn.addEventListener('click', renderGamePage);
  createGameBtn.innerText = 'Create New Game';
  createGameBtn.classList.add('btn', 'btn-success', 'btn-lg')
  mainContainer.appendChild(createGameBtn); 
}

const authUserLogin = () => {
  const userInfo = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  }
  console.log(userInfo);
  axios.post('/login', userInfo)
    .then((result) => {
      if (result.data === 'valid'){
        renderStartPage();
      } else {
        return
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

const renderLoginPage = () => {
  loginContainer.classList.add('login_container')
  emailInput.placeholder = 'email';
  passwordInput.placeholder = 'password';
  submitBtn.innerText = "Login";
  submitBtn.setAttribute('type', 'submit');

  [emailInput, passwordInput, submitBtn].forEach(element => {
    element.id = element.placeholder || element.innerText;
    element.classList.add('form-control', 'my-4');
    submitBtn.classList.add('btn', 'btn-primary')
    loginContainer.appendChild(element);
  })
  mainContainer.appendChild(loginContainer);
  submitBtn.addEventListener('click', authUserLogin);
}

// manipulate DOM, set up create game button


renderLoginPage();
