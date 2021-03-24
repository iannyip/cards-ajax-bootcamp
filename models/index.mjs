import { Sequelize } from 'sequelize';
import allConfig from '../config/config.js';

import gameModel from './game.mjs';
import UserModel from './user.mjs';

const env = process.env.NODE_ENV || 'development';

const config = allConfig[env];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// add your model definitions to db here
db.Game = gameModel(sequelize, Sequelize.DataTypes);
db.User = UserModel(sequelize, Sequelize.DataTypes);

// One to many relationships
db.User.belongsToMany(db.Game, {through: 'game_users'});
db.Game.belongsToMany(db.User, {through: 'game_users'});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
