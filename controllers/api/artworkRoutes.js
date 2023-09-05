const router = require('express').Router();
const multer = require('multer');
const { Artwork, User, Comment, UserFollow, ArtworkTag } = require('../../models');
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

router.get('/:artwork_id/comment', withAuth, async (req, res) => {
  try {
    const artwork_id = req.params.artwork_id;
    console.log('Received artwork ID:', artwork_id);
    const comments = await Comment.findAll({ where: { artwork_id: artwork_id } });
    console.log('Sending response'); 
    res.json(comments);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/:artwork_id/comment', withAuth, async (req, res) => {
  try {
    const { text } = req.body;
    const artwork_id = req.params.artwork_id;
    const user_id = req.session.user_id;

    const newComment = await Comment.create({ // Use Comment model
      text,
      user_id: user_id,
      artwork_id: artwork_id,
      date_created: new Date(),
    });

    // Redirect back to the artwork page after adding the comment
    res.redirect(`/api/artwork/${artwork_id}`);
  } catch (err) {
    console.error('Error in comment route:', err);
    res.status(500).json(err);
  }
});

router.post('/update-emoji', withAuth, async (req, res) => {
  try {
    const { emojiType, targetType, targetId } = req.body;
    console.log('Received request with payload:', req.body);

    let updatedCounts = {};

    if (targetType === 'comment') {
      // Handle emoji update for comments
      if (emojiType === 'heart_eyes') {
        // Update the heart-eyes count for the comment
        const updatedComment = await Comment.increment('heart_eyes_count', {
          where: { id: targetId },
        });
        console.log('Updated comment:', updatedComment);
        updatedCounts = {
          heart_eyes: updatedComment[0]['heart_eyes_count'],
          trash_can: 0, // Initialize trash_can count for comments (you can update it similarly)
        };
      } else if (emojiType === 'trash_can') {
        // Update the trash-can count for the comment
        const updatedComment = await Comment.increment('trash_can_count', {
          where: { id: targetId },
        });
        updatedCounts = {
          heart_eyes: 0, // Initialize heart_eyes count for comments (you can update it similarly)
          trash_can: updatedComment[0]['trash_can_count'],
        };
      } else {
        // Handle invalid emojiType for comments
        res.status(400).json({ success: false, message: 'Invalid emoji type' });
        return;
      }
    } else if (targetType === 'artwork') {
      // Handle emoji update for artwork
      if (emojiType === 'heart_eyes') {
        // Update the heart-eyes count for the artwork
        const updatedArtwork = await Artwork.increment('heart_eyes_count', {
          where: { id: targetId },
        });
        console.log('Updated artwork:', updatedArtwork);
        updatedCounts = {
          heart_eyes: updatedArtwork[0]['heart_eyes_count'],
          trash_can: 0, // Initialize trash_can count for artwork (you can update it similarly)
        };
      } else if (emojiType === 'trash_can') {
        // Update the trash-can count for the artwork
        const updatedArtwork = await Artwork.increment('trash_can_count', {
          where: { id: targetId },
        });
        updatedCounts = {
          heart_eyes: 0, // Initialize heart_eyes count for artwork (you can update it similarly)
          trash_can: updatedArtwork[0]['trash_can_count'],
        };
      } else {
        // Handle invalid emojiType for artwork
        res.status(400).json({ success: false, message: 'Invalid emoji type' });
        return;
      }
    } else {
      // Handle invalid targetType here
      res.status(400).json({ success: false, message: 'Invalid target type' });
      return;
    }

    if (Object.keys(updatedCounts).length > 0) {
      // Counts have been updated, you can proceed
      console.log('Updated counts:', updatedCounts);
      res.json({ success: true, counts: updatedCounts, targetId });
    } else {
      // Handle the case where the counts are not updated
      res.status(500).json({ success: false, message: 'Counts not updated' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.get('/:artwork_id/emojis', withAuth, async (req, res) => {
  try {
    const artworkId = req.params.artwork_id;

    const artwork = await Artwork.findByPk(artworkId);

    if (!artwork) {
      // Handle the case where the artwork is not found
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Extract the emoji counts from the artwork object
    const emojis = {
      heart_eyes: artwork.heart_eyes_count,
      trash_can: artwork.trash_can_count,
    };

    // Send the emojis as a JSON response
    res.json({ emojis });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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
      ],
    });

    if (!artworkData) {
      res.status(404).json({ message: 'No artwork with that id!' });
      return;
    }

    const artwork = artworkData.get({ plain: true });

    // Fetch the comments associated with the artwork, including user information
    const commentData = await Comment.findAll({
      where: { artwork_id: artwork_id },
      include: [{ model: User }],
    });
    const comments = commentData.map((comment) => comment.get({ plain: true }));
    // Render the Handlebars template with the artwork and comments data
    res.render('artwork', {
      artwork,
      comments,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error('Error in /artwork/:artwork_id route:', err);
    res.status(500).json(err);
  }
});


  
  module.exports = router;