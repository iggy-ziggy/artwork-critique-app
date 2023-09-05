const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

class Artwork extends Model {}

Artwork.init(
  {
    artwork_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field:'id',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    media: {
      type: DataTypes.STRING,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      }
    },
    heart_eyes_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Initial count is zero
    },
    trash_can_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Initial count is zero
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'artwork',
  }
);

module.exports = Artwork;