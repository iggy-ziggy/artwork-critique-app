const router = require('express').Router();
const userRoutes = require('./userRoutes');
const profileroutes = require('./profileroutes');
const artworkRoutes = require('./artworkRoutes');
const tagRoutes = require('./tagRoutes');

router.use('/users', userRoutes);
router.use('/profiles', profileroutes);
router.use('/artwork', artworkRoutes);
router.use('/tags', tagRoutes);

module.exports = router;
