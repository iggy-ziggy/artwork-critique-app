const { ArtworkTag } = require('../models');

const artworkTagData = [
  {
    product_id: 1,
    tag_id: 1,
  },
  {
    product_id: 2,
    tag_id: 1,
  },
  {
    product_id: 3,
    tag_id: 1,
  },
  {
    product_id: 4,
    tag_id: 3,
  },
  {
    product_id: 5,
    tag_id: 3,
  },
  {
    product_id: 6,
    tag_id: 3,
  },
  {
    product_id: 7,
    tag_id: 4,
  },
  {
    product_id: 8,
    tag_id: 4,
  },
  {
    product_id: 9,
    tag_id: 4,
  },
];

const seedArtworkTags = () => ArtworkTag.bulkCreate(artworkTagData);

module.exports = seedArtworkTags;
