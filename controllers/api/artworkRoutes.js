const router = require('express').Router();
const multer = require('multer');
const { Artwork, User, Tag } = require('../../models');
const withAuth = require('../../utils/auth');
const path = require('path');
const { addImage } = require('../../utils/addImage');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

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
  
  module.exports = router;