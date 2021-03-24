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
const player1Win = document.createElement('div');
const player2Win = document.createElement('div');
const player1Card = document.createElement('div');
const player2Card = document.createElement('div');

// For login page
const loginContainer = document.createElement('div');
const emailInput = document.createElement('input');
const passwordInput = document.createElement('input');
const submitBtn = document.createElement('button');


// DOM manipulation function that displays the player's current hand.
const runGame = function ({ playerHand }) {
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

  if (playerHand[0].rank > playerHand[1].rank){
    player1Win.innerText = "PLAYER 1 WON";
    player2Win.innerText = "";
  } else if (playerHand[0].rank < playerHand[1].rank){
    player1Win.innerText = "";
    player2Win.innerText = 'PLAYER 2 WON';
  } else {
    player1Win.innerText = "DRAW";
    player2Win.innerText = "DRAW";
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
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

const renderGamePage = () => {
  mainContainer.innerHTML = '';
  mainContainer.appendChild(btnsContainer);
  mainContainer.appendChild(dealListDiv);
 
  // Style buttons
  btnsContainer.classList.add('d-flex', 'justify-content-around', 'p-4');
  console.log('about to add buttons');
  [refreshGameBtn, dealBtn].forEach((element) => {
    btnsContainer.appendChild(element);
    element.classList.add('btn', 'btn-primary', 'btn-long');
    console.log('btn added');
  });
  dealBtn.innerText = 'Deal';
  refreshGameBtn.innerText = 'Refresh';
  dealBtn.addEventListener('click', dealCards);

  // Style table
  dealListDiv.classList.add('row', 'justify-content-around');
  [player1Win, player2Win, player1Card, player2Card].forEach((boxe) => {
    dealListDiv.appendChild(boxe)
    boxe.classList.add('col-5', 'col-grey');
  })
  
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

renderLoginPage();
