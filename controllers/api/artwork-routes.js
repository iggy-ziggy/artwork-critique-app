const router = require('express').Router();
const { Artwork, User, Tag, ArtworkTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const artworkData = await Artwork.findAll({
      include: [{ model: User }, { model: Tag }],
    });
    res.status(200).json(artworkData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const artworkData = await Artwork.findByPk(req.params.id, 
      {
        include: [{ model: User }, { model: Tag }],
      });
      if (!artworkData) {
        res.status(404).json({ message: 'No artwork with that id!'});
        return;
      }
      res.status(200).json(artworkData);
  } catch (err) {
    res.status(500).json(err);
  }
});

/*
router.post('/', async (req, res) => {
  Artwork.create(req.body)
    .then((artwork) => {
      // if there's artwork tags, we need to create pairings to bulk create in the artworkTag model
      if (req.body.tagIds.length) {
        const artworkTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            artwork_id: artwork.id,
            tag_id,
          };
        });
        return ArtworkTag.bulkCreate(artworkTagIdArr);
      }
      // if no artwork tags, just respond
      res.status(200).json(artwork);
    })
    .then((artworkTagIds) => res.status(200).json(artworkTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update artwork
router.put('/:id', (req, res) => {
  // update artwork data
  Artwork.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((artwork) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ArtworkTag.findAll({
          where: { artwork_id: req.params.id }
        }).then((artworkTags) => {
          // create filtered list of new tag_ids
          const artworkTagIds = artworkTags.map(({ tag_id }) => tag_id);
          const newArtworkTags = req.body.tagIds
          .filter((tag_id) => !artworkTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              artwork_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const artworkTagsToRemove = artworkTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ArtworkTag.destroy({ where: { id: artworkTagsToRemove } }),
            ArtworkTag.bulkCreate(newArtworkTags),
          ]);
        });
      }

      return res.json(artwork);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one artwork by its `id` value
  try {
    const artworkData = await Artwork.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!artworkData) {
      res.status(404).json({ message: 'No artwork found with that id!'});
      return;
    }
    res.status(200).json(artworkData);
  } catch (err) {
    res.status(500).json(err);
  }
});
*/
module.exports = router;
