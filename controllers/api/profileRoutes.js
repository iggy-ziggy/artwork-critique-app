const router = require('express').Router();
const { User, Profile } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const profileData = await Profile.findAll({
      include: [{ model: User }],
    });
    res.status(200).json(profileData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const profileData = await Profile.findByPk(req.params.id, {
      include: [{ model: User }],
    });
    res.status(200).json(profileData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;