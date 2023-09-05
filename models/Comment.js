const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      }
    },
    artwork_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'artwork',
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
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment',
  }
);

module.exports = Comment;
