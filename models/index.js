// import models
const Artwork = require('./Artwork');
const User = require('./User');
const Comment = require('./Comment');
const Tag = require('./Tag');
const ArtworkTag = require('./ArtworkTag');
const Profile = require('./Profile');


Artwork.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

User.hasMany(Artwork, {
  foreignKey: 'user_id',
});

Comment.belongsTo(Artwork, {
  foreignKey: 'artwork_id',
  onDelete: 'CASCADE',
});

Artwork.hasMany(Comment, {
  foreignKey: 'artwork_id',
});

Comment.belongsTo(User, {
  foreignKey: 'user_id',
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
});

Artwork.belongsToMany(Tag, { through: ArtworkTag,
  foreignKey: 'artwork_id',
});

Tag.belongsToMany(Artwork, { through: ArtworkTag,
  foreignKey: 'tag_id',
});

Profile.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

User.hasOne(Profile, {
  foreignKey: 'user_id',
});

module.exports = {
  Artwork,
  User,
  Comment,
  Tag,
  ArtworkTag,
  Profile,
};
