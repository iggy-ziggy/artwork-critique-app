const router = require('express').Router();
const multer = require('multer');
const { Artwork, User, Tag } = require('../../models');
const withAuth = require('../../utils/auth');
const path = require('path');
const { addImage } = require('../../utils/addImage');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

// render upload form
router.get('/upload', async (req, res) => {
  res.render('upload');
});

// get all artwork
// router.get('/', async (req, res) => {
//   try {
//     const artworkData = await Artwork.findAll({
//       include: [{ model: User }, { model: Tag }],
//     });
//     res.status(200).json(artworkData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// get one artwork
// router.get('/:id', async (req, res) => {
//   try {
//     const artworkData = await Artwork.findByPk(req.params.id, 
//       {
//         include: [{ model: User }, { model: Tag }],
//       });
//       if (!artworkData) {
//         res.status(404).json({ message: 'No artwork with that id!'});
//         return;
//       }
//       res.status(200).json(artworkData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// create new artwork
router.post('/upload', withAuth, upload, async (req, res) => {
  try {
    console.log('Received Upload request');
    const user_id = req.session.user_id;
    console.log('User ID:', user_id);

    const imageUrl = await addImage(req, res);
    console.log('Artwork URL', imageUrl);

    const currentDate = new Date(); // Get the current date and time
      
    const newArtwork = await Artwork.create({
      name: req.body.name,
      description: req.body.description,
      imageUrl: imageUrl,
      date_created: currentDate,
      user_id: user_id,
    });

      console.log('New artwork:', newArtwork);

      res.status(200).json(newArtwork);
    } catch (err) {
      console.error('Error in upload route:', err);
      res.status(400).json(err);
    }
  });

  // get and render all artwork
router.get('/', async (req, res) => {
  try {
    const artworkData = await Artwork.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const artworks = artworkData.map((artwork) => artwork.get({ plain: true }));

    res.render('allArtwork', { 
      artworks, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get and render single artwork page
router.get('/:id', async (req, res) => {
  try {
    const artworkData = await Artwork.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    if (!artworkData) {
      res.status(404).json({ message: 'No artwork with that id!'});
      return;
    }

    const artwork = artworkData.get(({ plain: true }));

    res.render('artwork', { 
      artwork, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
  
  module.exports = router;