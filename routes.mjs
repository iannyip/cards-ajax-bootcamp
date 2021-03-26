import db from './models/index.mjs';

import initGamesController from './controllers/games.mjs';
import initUsersController from './controllers/users.mjs';

export default function bindRoutes(app) {
  const GamesController = initGamesController(db);
  const UsersController = initUsersController(db);
  // main page
  app.get('/', GamesController.index);
  // create a new game
  app.post('/games', GamesController.create);
  // Add results to game
  app.post('/games/:id/postresult', GamesController.update);
  // update a game with new cards
  app.put('/games/:id/deal', GamesController.deal);
  app.get('/games/:id/refresh', GamesController.refresh);

  app.post('/login', UsersController.login);
  app.get('/test', UsersController.index);
}
