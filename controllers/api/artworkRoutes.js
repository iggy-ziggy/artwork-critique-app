const router = require('express').Router();
const multer = require('multer');
const { Artwork, User, Comment, ArtworkTag } = require('../../models');
const withAuth = require('../../utils/auth');
const path = require('path');
const { addImage } = require('../../utils/addImage');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// render upload form
router.get('/upload', withAuth, async (req, res) => {
  res.render('upload');
});

// create new artwork
router.post('/upload', withAuth, upload.single('artworkPicture'), async (req, res) => {
  try {
    console.log('Received Upload request');
    const user_id = req.session.user_id;
    console.log('User ID:', user_id);

    const { title, description } = req.body;
    const artworkPicture = req.file;

    let imageUrl;

    if (artworkPicture) {
      // Process the artwork picture and get the image URL
      imageUrl = await addImage(req, res);
      console.log('Artwork URL', imageUrl);

      if (!imageUrl) {
        console.error('Download URL is undefined');
        // Handle the case where the download URL is undefined, e.g., by returning an error response
        return res.status(500).json({ message: 'Download URL is undefined' });
      }  
    }  

    // Ensure imageUrl is defined before using it
    if (imageUrl) {
      // Create the new artwork entry with the image URL
      const currentDate = new Date(); // Get the current date and time
      
      const newArtwork = await Artwork.create({
        title: req.body.title,
        description: req.body.description,
        image_url: imageUrl,
        date_created: currentDate,
        user_id: user_id,
      });

      console.log('New artwork:', newArtwork);

      res.status(200).json(newArtwork);
    } else {
      // Handle the case when there is no artworkPicture
      res.status(400).json({ message: 'No artwork picture provided' });
    }
  } catch (err) {
    console.error('Error in upload route:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// add comment to artwork
router.post('/:id/comment', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      text: req.body.text,
      // ...req.body,
      user_id: req.session.user_id,
      artwork_id: req.params.id,
    });
    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  } 
});

// for insomnia route testing only
router.get('/comment', async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      include: [{ model: User }],
    });
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
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
          // attributes: ['name'],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
            }
          ]
        },
      ],
    });
    if (!artworkData) {
      res.status(404).json({ message: 'No artwork with that id!'});
      return;
    }

    const artwork = artworkData.get({ plain: true });

    res.render('artwork', { 
      artwork, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


  
  module.exports = router;