/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Card Deck Functions
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

// get a random index from an array given it's size

const getRandomWithExclude = (length, excludedNo) => {
  const randomNo = Math.floor(Math.random() * length) + 1;
  if (Number(randomNo) === Number(excludedNo)) {
    console.log(`${randomNo} = ${excludedNo}`);
    return getRandomWithExclude(length, excludedNo);
  }
  // let randomNo;
  // while (randomNo === excludedNo) {
  //   randomNo = Math.floor(Math.random() * length) + 1;
  //   console.log(`${randomNo} = ${excludedNo}`);
  // }
  // console.log('this ran');
  return randomNo;
};

const getRandomIndex = function (size) {
  return Math.floor(Math.random() * size);
};

// cards is an array of card objects
const shuffleCards = function (cards) {
  let currentIndex = 0;

  // loop over the entire cards array
  while (currentIndex < cards.length) {
    // select a random position from the deck
    const randomIndex = getRandomIndex(cards.length);

    // get the current card in the loop
    const currentItem = cards[currentIndex];

    // get the random card
    const randomItem = cards[randomIndex];

    // swap the current card and the random card
    cards[currentIndex] = randomItem;
    cards[randomIndex] = currentItem;

    currentIndex += 1;
  }

  // give back the shuffled deck
  return cards;
};

const makeDeck = function () {
  // create the empty deck at the beginning
  const deck = [];

  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  let suitIndex = 0;
  while (suitIndex < suits.length) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];

    // loop to create all cards in this suit
    // rank 1-13
    let rankCounter = 1;
    while (rankCounter <= 13) {
      let cardName = rankCounter;

      // 1, 11, 12 ,13
      if (cardName === 1) {
        cardName = 'ace';
      } else if (cardName === 11) {
        cardName = 'jack';
      } else if (cardName === 12) {
        cardName = 'queen';
      } else if (cardName === 13) {
        cardName = 'king';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // add the card to the deck
      deck.push(card);

      rankCounter += 1;
    }
    suitIndex += 1;
  }

  return deck;
};

const countWins = (array, user) => {
  let wins = 0;
  array.forEach((result) => {
    if (result === user) {
      wins += 1;
    }
  });
  return wins;
};

/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Controller Functions
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

export default function initGamesController(db) {
  // render the main page
  const index = (request, response) => {
    response.render('games/index');
  };

  // create a new game. Insert a new row in the DB.
  const create = async (request, response) => {
    // deal out a new shuffled deck for this game.
    const cardDeck = shuffleCards(makeDeck());
    const playerHand = [cardDeck.pop(), cardDeck.pop()];
    const results = [];
    const players = [];
    const { userId } = request.cookies;
    console.log(userId);

    const newGame = {
      gameState: {
        cardDeck,
        playerHand,
        results,
        players,
      },
    };

    try {
      // run the DB INSERT query
      const game = await db.Game.create(newGame);
      const player1 = await db.User.findOne({ where: { id: userId } });
      const users = await db.User.findAll();
      console.log(users);
      const randomNo = await getRandomWithExclude(users.length, userId);
      console.log(`length: ${users.length}, user: ${userId}`);
      console.log('random number:', randomNo);
      const player2 = users[randomNo - 1];
      console.log('player 2:', player2);
      console.log(`Player 1: ${player1.id}`);
      console.log(`Player 2: ${player2.id}`);
      const p1Game = await game.addUser(player1);
      const p2Game = await game.addUser(player2);
      newGame.gameState.players = [player1.id, player2.id];
      await game.update(newGame);
      console.log(game.gameState);

      // send the new game back to the user.
      // dont include the deck so the user can't cheat
      response.send({
        id: game.id,
        p1Name: player1.id,
        p2Name: player2.id,
        playerHand: game.gameState.playerHand,
        results: [0, 0],
      });
    } catch (error) {
      response.status(500).send(error);
    }
  };

  const update = async (request, response) => {
    try {
      // Get exising game info
      const game = await db.Game.findByPk(request.params.id);
      const gameUpdate = game.gameState;
      console.log('~~~~~~ BEFORE ~~~~~~~');
      console.log(gameUpdate);

      // Checkout new result
      console.log('#############');
      console.log('results came in: ', request.body.winner);
      console.log('previous results: ', gameUpdate.results);
      console.log('#############');

      // Update db
      gameUpdate.results.push(request.body.winner);
      console.log('#############');
      console.log(gameUpdate.results);
      await db.Game.update(
        { gameState: gameUpdate },
        { where: { id: game.id } },
      );
      console.log('~~~~~~ AFTER ~~~~~~~');
      console.log(game.gameState);
      response.send('thanks');
    } catch (error) {
      console.log(error);
    }
  };

  // deal two new cards from the deck.
  const deal = async (request, response) => {
    try {
      // get the game by the ID passed in the request
      const game = await db.Game.findByPk(request.params.id);

      // make changes to the object
      const playerHand = [game.gameState.cardDeck.pop(), game.gameState.cardDeck.pop()];

      // update the game with the new info
      await game.update({
        gameState: {
          cardDeck: game.gameState.cardDeck,
          playerHand,
          results: game.gameState.results,
          players: game.gameState.players,
        },

      });

      // send the updated game back to the user.
      // dont include the deck so the user can't cheat
      const winsArr = [
        countWins(game.gameState.results, game.gameState.players[0]),
        countWins(game.gameState.results, game.gameState.players[1]),
      ];

      response.send({
        id: game.id,
        p1Name: game.gameState.players[0],
        p2Name: game.gameState.players[1],
        playerHand: game.gameState.playerHand,
        results: winsArr,
      });
    } catch (error) {
      response.status(500).send(error);
    }
  };

  const refresh = async (request, response) => {
    try {
      const game = await db.Game.findByPk(request.params.id);
      console.log('refreshing...');
      console.log(game.gameState);
      const winsArr = [
        countWins(game.gameState.results, game.gameState.players[0]),
        countWins(game.gameState.results, game.gameState.players[1]),
      ];
      response.send({
        id: game.id,
        p1Name: game.gameState.players[0],
        p2Name: game.gameState.players[1],
        playerHand: game.gameState.playerHand,
        results: winsArr,
      });
    } catch (error) {
      response.status(500).send(error);
    }
  };

  // return all functions we define in an object
  // refer to the routes file above to see this used
  return {
    deal,
    create,
    update,
    index,
    refresh,
  };
}
