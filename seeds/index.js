const seedUsers = require('./user-seeds');
const seedProfiles = require('./profile-seeds')
const seedArtwork = require('./artwork-seeds');
const seedTags = require('./tag-seeds');
const seedArtworkTags = require('./artwork-tag-seeds');

const sequelize = require('../config/connection');

const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log('\n----- DATABASE SYNCED -----\n');
  
  await seedUsers();
  console.log('\n----- USERS SEEDED -----\n');

  await seedProfiles();
  console.log('\n----- PROFILES SEEDED -----\n');

  await seedArtwork();
  console.log('\n----- ARTWORK SEEDED -----\n');

  await seedTags();
  console.log('\n----- TAGS SEEDED -----\n');

  await seedArtworkTags();
  console.log('\n----- ARTWORK TAGS SEEDED -----\n');

  process.exit(0);
};

seedAll();
