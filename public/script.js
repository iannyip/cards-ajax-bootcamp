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
const scoreboardRow = document.createElement('div');
const player1Score = document.createElement('div');
const player2Score = document.createElement('div');

// For login page
const loginContainer = document.createElement('div');
const emailInput = document.createElement('input');
const passwordInput = document.createElement('input');
const submitBtn = document.createElement('button');

const refresh = () => {
  console.log('banana');
  axios
    .get(`/games/${currentGame.id}/refresh`)
    .then((response) => {
      // get the updated hand value
      currentGame = response.data;
      playerHand = currentGame.playerHand;

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

      player1Score.innerText = currentGame.results[0];
      player2Score.innerText = currentGame.results[1];

      // display it to the user
      // runGame(currentGame);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

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

  // Update scoreboard
  player1Score.innerText = currentGame.results[0];
  player2Score.innerText = currentGame.results[1];

  // Determine winner
  let winner;
  if (playerHand[0].rank > playerHand[1].rank) {
    winner = currentGame.p1Name;
    player1Win.innerText = 'PLAYER 1 WON';
    player2Win.innerText = '';
    console.log(currentGame.results[0] + 1);
  } else if (playerHand[0].rank < playerHand[1].rank) {
    winner = currentGame.p2Name;
    player1Win.innerText = '';
    player2Win.innerText = 'PLAYER 2 WON';
    console.log(currentGame.results[1] + 1);
  } else {
    winner = null;
    player1Win.innerText = 'DRAW';
    player2Win.innerText = 'DRAW';
  }
  console.log('winner: ', winner);
  // update results in db
  axios
    .post(`/games/${currentGame.id}/postresult`, { winner })
    .then(() => {
      console.log('result posted');
      refresh();
    })
    .catch((error) => {
      console.log(error);
    });
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
  axios
    .put(`/games/${currentGame.id}/deal`)
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
  mainContainer.appendChild(scoreboardRow);

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
  refreshGameBtn.addEventListener('click', refresh);

  // Style rows
  [playerWinRow, dealListRow, playerNameRow, scoreboardRow].forEach((row) => {
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
  [player1Score, player2Score].forEach((element) => {
    scoreboardRow.appendChild(element);
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
        // do nothing
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
