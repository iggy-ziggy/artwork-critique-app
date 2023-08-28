const router = require('express').Router();
const userRoutes = require('./userRoutes');
const profileRoutes = require('./profileRoutes');
const artworkRoutes = require('./artworkRoutes');
const tagRoutes = require('./tagRoutes');

router.use('/users', userRoutes);
router.use('/profiles', profileRoutes);
router.use('/artwork', artworkRoutes);
router.use('/tags', tagRoutes);

module.exports = router;
