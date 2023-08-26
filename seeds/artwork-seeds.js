const { Artwork } = require('../models');

const artworkData = [
  {
    title: 'Sunflower',
    description:
      'To me, these things always seem halfway between life and death.',
    media: 'oil paint',
    user_id: 1,
  },
  {
    title: 'Sunflower2',
    description:
      'To me, these things always seem halfway between life and death.',
    media: 'oil paint',
    user_id: 1,
  },
  {
    title: 'Sunflower3',
    description:
      'To me, these things always seem halfway between life and death.',
    media: 'oil paint',
    user_id: 1,
  },
  {
    title: 'Thinker',
    description: 'A maquette in clay for a much larger sculpture.',
    media: 'clay',
    user_id: 2,
  },
  {
    title: 'Thinker2',
    description: 'A maquette in clay for a much larger sculpture.',
    media: 'clay',
    user_id: 2,
  },
  {
    title: 'Thinker3',
    description: 'A maquette in clay for a much larger sculpture.',
    media: 'clay',
    user_id: 2,
  },
  {
    title: 'Spider',
    description: 'A steel cage frame with cast bronze figure.',
    media: 'mixed media',
    user_id: 3,
  },
  {
    title: 'Spider2',
    description: 'A steel cage frame with cast bronze figure.',
    media: 'mixed media',
    user_id: 3,
  },
  {
    title: 'Spider3',
    description: 'A steel cage frame with cast bronze figure.',
    media: 'mixed media',
    user_id: 3,
  },
];

const seedArtwork = () => Artwork.bulkCreate(artworkData);

module.exports = seedArtwork;
