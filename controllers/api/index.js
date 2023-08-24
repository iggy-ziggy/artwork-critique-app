const router = require('express').Router();
const userRoutes = require('./user-routes');
const profileRoutes = require('./profile-routes');
const artworkRoutes = require('./artwork-routes');
const tagRoutes = require('./tag-routes');

router.use('/users', userRoutes);
router.use('/profiles', profileRoutes);
router.use('/artwork', artworkRoutes);
router.use('/tags', tagRoutes);

module.exports = router;
