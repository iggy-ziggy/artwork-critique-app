const router = require('express').Router();
const { Artwork , User, Profile } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all artworks and JOIN with user data
    const artworkData = await Artwork.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const artworks = artworkData.map((artwork) => artwork.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      artworks, 
      logged_in: req.session.logged_in // If the user isn't logged in, they should still see artwork, but will lack the comment functionality - Zach
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// login
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
