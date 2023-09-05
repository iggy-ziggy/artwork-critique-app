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
      res.status(400).json({ message: 'No artwork picture provided' });
    }
  } catch (err) {
    console.error('Error in upload route:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// add comment to artwork
router.post('/comment', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create(
      {
        text: req.body,
      },
    )
    res.status(200).json(newComment);
  } catch (err) {
    console.error('Error in comment route:', err);
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

router.get('/:artwork_id', async (req, res) => {
  try {
    const artwork_id = req.params.artwork_id;

    // Fetch the artwork details
    const artworkData = await Artwork.findByPk(artwork_id, {
      include: [
        {
          model: User,
        },
        {
          model: Comment,
        }
      ],
    });

    if (!artworkData) {
      res.status(404).json({ message: 'No artwork with that id!' });
      return;
    }

    const artwork = artworkData.get({ plain: true });

    // Fetch the comments associated with the artwork
    const comments = await Comment.findAll({
      where: { artwork_id: artwork_id },
      raw: true,
    });
    
    // Render the Handlebars template with the artwork and comments data
    res.render('artwork', {
      artwork,
      comments, // Pass the comments to the template
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error('Error in /artwork/:artwork_id route:', err);
    res.status(500).json(err);
  }
});


  
  module.exports = router;