'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CodeOutput extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CodeOutput.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    language: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CodeOutput',
  });
  return CodeOutput;
};