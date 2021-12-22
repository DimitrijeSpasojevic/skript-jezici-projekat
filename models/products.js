'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Categories}) {
      // define association here
      this.belongsTo(Categories, {foreignKey: 'categoryId', as: 'category'});
    }
  };
  Products.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    price:{
      allowNull: false,
      type: DataTypes.INTEGER
    },
    description:{
      type: DataTypes.STRING
    },
    rate: DataTypes.INTEGER,
    categoryId:{
      allowNull: false,
      type: DataTypes.INTEGER
    } 
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};