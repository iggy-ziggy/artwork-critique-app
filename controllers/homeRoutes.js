const router = require('express').Router();
const { Artwork , User, Profile } = require('../models');
const withAuth = require('../utils/auth');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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

router.get('/search/:result', async (req, res) => {
  try {
    const title = req.params.result;
    console.log('Search Query:', title);

    const resultData = await Artwork.findAll({ where: 
      { 
        title: { [Op.like]: '%' + title + '%' }
      },
      include: [
        {
          model: User,
          attributes: {exclude: ['password']},
        },
      ],
    });
    console.log('Search Results:', resultData);
    const results = resultData.map((artwork) => artwork.get({ plain: true }));

    console.log(results);
    // res.status(200).json(results);
    res.render('results-page', { results });
  } catch (err) {
    console.error('Error:', err);
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

router.get('/search/:result', async (req, res) => {
  try {
    const title = req.params.result;
    console.log(title);

    const resultData = await Artwork.findAll({ where: 
      { 
        title: { [Op.like]: '%' + title + '%' }
      },
      include: [
        {
          model: User,
          attributes: {exclude: ['password']},
        },
      ],
    });

    const results = resultData.map((artwork) => artwork.get({ plain: true }));

    console.log(results);

    res.render('results-page', {results});
    // console.log(results);
    // res.status(200).json(results);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
