'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GameResult.init({
    playerName: DataTypes.STRING,
    status: DataTypes.STRING,
    completionTime: DataTypes.INTEGER,
    totalTime: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GameResult',
  });
  return GameResult;
};