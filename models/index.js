const User = require('./User');
const Gallery = require('./Gallery');
const Artwork = require('./Artwork');
const Tag = require('./Tag');
const Profile = require('./Profile');

User.hasOne(Profile, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Profile.belongsTo(User, {
  foreignKey: 'user_id',
});

User.hasOne(Gallery, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Gallery.belongsTo(User, {
  foreignKey: 'user_id',
});

Gallery.hasMany(Artwork, {
  foreignKey: 'gallery_id',
  onDelete: 'CASCADE',
});

Artwork.belongsTo(Gallery, {
  foreignKey: 'gallery_id',
});

Artwork.hasMany(Tag, {
  foreignKey: 'artwork_id',
});

Tag.belongsToMany(Artwork, {
  foreignKey: 'artwork_id',
});

module.exports = { User, Gallery, Artwork, Tag, Profile };
