const { User } = require('../models');

const userData = [
  {
    username: 'theCryingDutchman',
    email: 'wheresMyEar@hotmail.com',
    password: 'password12345',
  },
  {
    username: 'bigBronze',
    email: 'statuesque@gmail.com',
    password: 'password12345',
  },
  {
    username: 'mamanFemme',
    email: 'howBourgeois@aol.com',
    password: 'password12345',
  },
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;
