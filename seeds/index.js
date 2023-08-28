const sequelize = require('../config/connection');
const { User, Artwork, Profile, ArtworkTag, Tag } = require('../models');

const userData = require('./userSeeds.json');
const profileData = require('./profileSeeds.json');
const artworkData = require('./artworkSeeds.json');
const artworkTagData = require('./artworkTagSeeds.json');
const tagData = require('./tagSeeds.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });
  console.log('\n----- DATABASE SYNCED -----\n');

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  console.log('\n----- USERS SEEDED -----\n');

  const artwork = await Artwork.bulkCreate(artworkData);
  console.log('\n----- ARTWORK SEEDED -----\n');

  const profiles = await Profile.bulkCreate(profileData);
  console.log('\n----- PROFILES SEEDED -----\n');

  const tag = await Tag.bulkCreate(tagData);
  console.log('\n----- TAGS SEEDED -----\n');
  
  const artworkTag = await ArtworkTag.bulkCreate(artworkTagData);
  console.log('\n----- ARTWORKTAGS SEEDED -----\n');

  process.exit(0);
};

seedDatabase();