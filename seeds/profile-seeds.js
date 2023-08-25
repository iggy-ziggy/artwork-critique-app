const { Profile } = require("../models");

const profileData = [
  {
    name: "Vincent",
    pronouns: "he/him",
    bio: "It is good to love many things, for therein lies the true strength, and whosoever loves much performs much, and can accomplish much, and what is done in love is well done.",
    media: "oil paint",
    user_id: 1,
  },
  {
    name: "Auguste",
    pronouns: "he/him",
    bio: "Sculpture is the art of the hole and the lump.",
    media: "clay, bronze",
    user_id: 2,
  },
  {
    name: "Louise",
    pronouns: "she/her",
    bio: "To express your emotions, you have to be very loose and receptive. The unconscious will come to you if you have that gift that artists have. I only know if I am inspired by the results.",
    media: "all",
    user_id: 3,
  },
];

const seedProfiles = () => Profile.bulkCreate(profileData);

module.exports = seedProfiles;