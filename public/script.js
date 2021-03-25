// global value that holds info about the current hand.
let currentGame = null;

// Start page layout
const mainContainer = document.getElementById('game-container');
mainContainer.classList.add('container');
const gameTitle = document.createElement('h1');
gameTitle.classList.add('game-title');
gameTitle.innerText = 'HIGH CARD';
const createGameBtn = document.createElement('button');

// Game layout
const btnsContainerRow = document.createElement('div');
const refreshGameBtn = document.createElement('button');
const dealBtn = document.createElement('button');
const playerNameRow = document.createElement('div');
const player1Name = document.createElement('div');
const player2Name = document.createElement('div');
const playerWinRow = document.createElement('div');
const player1Win = document.createElement('div');
const player2Win = document.createElement('div');
const dealListRow = document.createElement('div');
const player1Card = document.createElement('div');
const player2Card = document.createElement('div');

// For login page
const loginContainer = document.createElement('div');
const emailInput = document.createElement('input');
const passwordInput = document.createElement('input');
const submitBtn = document.createElement('button');

// DOM manipulation function that displays the player's current hand.
const runGame = ({ playerHand }) => {
  // manipulate DOM
  player1Card.innerText = `
    Player 1 Hand
    ====
    ${playerHand[0].name}
    of
    ${playerHand[0].suit}
    ====
  `;
  player2Card.innerText = `
    Player 2 Hand
    ====
    ${playerHand[1].name}
    of
    ${playerHand[1].suit}
    ====
  `;

  if (playerHand[0].rank > playerHand[1].rank) {
    player1Win.innerText = 'PLAYER 1 WON';
    player2Win.innerText = '';
  } else if (playerHand[0].rank < playerHand[1].rank) {
    player1Win.innerText = '';
    player2Win.innerText = 'PLAYER 2 WON';
  } else {
    player1Win.innerText = 'DRAW';
    player2Win.innerText = 'DRAW';
  }
};

const testFunction = async () => {
  axios.get('/test')
    .then(() => {
      console.log('test');
    })
    .catch((error) => console.log(error));
};

// make a request to the server
// to change the deck. set 2 new cards into the player hand.
const dealCards = () => {
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
// createGame() is the same as dealCards, except that the point to different routes
const createGame = () => {
  // Make a request to create a new game
  axios.post('/games')
    .then((response) => {
      // set the global value to the new game.
      currentGame = response.data;
      console.log(currentGame);

      // display it out to the user
      runGame(currentGame);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

const renderGamePage = () => {
  mainContainer.innerHTML = '';
  mainContainer.appendChild(gameTitle);
  mainContainer.appendChild(btnsContainerRow);
  mainContainer.appendChild(playerNameRow);
  mainContainer.appendChild(playerWinRow);
  mainContainer.appendChild(dealListRow);

  // Style buttons
  btnsContainerRow.classList.add('d-flex', 'justify-content-around', 'p-4');
  console.log('about to add buttons');
  [refreshGameBtn, dealBtn].forEach((element) => {
    btnsContainerRow.appendChild(element);
    element.classList.add('btn', 'btn-primary', 'btn-long');
    console.log('btn added');
  });
  dealBtn.innerText = 'Deal';
  refreshGameBtn.innerText = 'Refresh';
  dealBtn.addEventListener('click', dealCards);

  // Style rows
  [playerWinRow, dealListRow, playerNameRow].forEach((row) => {
    row.classList.add('row', 'justify-content-around');
  });
  [player1Win, player2Win].forEach((element) => {
    playerWinRow.appendChild(element);
    element.classList.add('col-5', 'col-grey');
  });
  [player1Name, player2Name].forEach((element) => {
    playerNameRow.appendChild(element);
    element.classList.add('col-5', 'col-grey');
  });
  [player1Card, player2Card].forEach((element) => {
    dealListRow.appendChild(element);
    element.classList.add('col-5', 'col-grey');
  });

  createGame();
};

const renderStartPage = () => {
  mainContainer.innerHTML = '';
  mainContainer.appendChild(gameTitle);
  createGameBtn.addEventListener('click', renderGamePage);
  createGameBtn.innerText = 'Create New Game';
  createGameBtn.classList.add('btn', 'btn-success', 'btn-lg');
  mainContainer.appendChild(createGameBtn);
};

const authUserLogin = () => {
  const userInfo = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  };
  console.log(userInfo);
  axios.post('/login', userInfo)
    .then((result) => {
      console.log(result.data === 'valid');
      console.log('user id: ', result.data);
      if (result.data !== null) {
        console.log(result.data);
        renderStartPage();
      } else {

      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const renderLoginPage = () => {
  loginContainer.classList.add('login_container');
  emailInput.placeholder = 'email';
  passwordInput.placeholder = 'password';
  submitBtn.innerText = 'Login';
  submitBtn.setAttribute('type', 'submit');

  [emailInput, passwordInput, submitBtn].forEach((element) => {
    element.id = element.placeholder || element.innerText;
    element.classList.add('form-control', 'my-4');
    submitBtn.classList.add('btn', 'btn-primary');
    loginContainer.appendChild(element);
  });
  mainContainer.appendChild(gameTitle);
  mainContainer.appendChild(loginContainer);
  submitBtn.addEventListener('click', authUserLogin);
};

renderLoginPage();
