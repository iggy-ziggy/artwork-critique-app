const router = require('express').Router();
const userRoutes = require('./userRoutes');
const profileroutes = require('./profileroutes');
const artworkRoutes = require('./artworkRoutes');

router.use('/users', userRoutes);
router.use('/profiles', profileroutes);
router.use('/artwork', artworkRoutes);

module.exports = router;
