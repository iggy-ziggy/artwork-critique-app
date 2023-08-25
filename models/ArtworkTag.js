const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ArtworkTag extends Model {}

ArtworkTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    artwork_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'artwork',
        key: 'id',
      }
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tag',
        key: 'id',
      }
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'artwork_tag',
  }
);

module.exports = ArtworkTag;
