'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Carts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Users}) {
      // define association here
      this.belongsTo(Users, {foreignKey: 'userId', as: 'user'});
    }
  };
  Carts.init({
    current_value: DataTypes.INTEGER,
    discount: DataTypes.INTEGER,
    quantity_of_product: DataTypes.INTEGER,
    userId: {
      allowNull:false,
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Carts',
  });
  return Carts;
};