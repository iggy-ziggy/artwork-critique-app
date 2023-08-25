const { Tag } = require('../models');

const tagData = [
  {
    tag_name: 'oil',
  },
  {
    tag_name: 'acrylic',
  },
  {
    tag_name: 'clay',
  },
  {
    tag_name: 'mixed media',
  },
  {
    tag_name: 'ink',
  },
  {
    tag_name: 'digital',
  },
  {
    tag_name: 'charcoal',
  },
  {
    tag_name: 'pastel',
  },
  {
    tag_name: 'assemblage',
  },
];

const seedTags = () => Tag.bulkCreate(tagData);

module.exports = seedTags;
