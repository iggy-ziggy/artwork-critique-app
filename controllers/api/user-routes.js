const router = require('express').Router();
const { User, Artwork } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Artworks
  try {
    const userData = await User.findAll({
      include: [{ model: Artwork}],
    });
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Artworks
  try {
    const userData = await User.findByPk(req.params.id, {
      include: [{ model: Artwork}],
    });
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const userData = await User.create(req.body);
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const userData = await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
      res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const userData = await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!userData) {
      res.status(404).json({ message: 'No user found with that id!'});
    }
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
