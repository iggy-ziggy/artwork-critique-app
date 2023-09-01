const router = require('express').Router();
const multer = require('multer');
const { User, Profile } = require('../../models');
const withAuth = require('../../utils/auth');
const path = require('path');
const { addImage } = require('../../utils/addImage');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

// get all profiles
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

// get one profile
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

// render profile
router.get('/', async (req, res) => {
  res.render('profile');
});

//render update profile form
router.get('/create/new', async (req, res) => {
  res.render('updateprofile');
});

// create profile
router.post('/update', withAuth, upload, async (req, res) => {
  try {
    console.log('Received Update request');
    const user_id = req.session.user_id;
    console.log('User ID:', user_id);

    const { name, pronouns, bio, media } = req.body;

    if (req.file) {
        const imageUrl = await addImage(req, res);
        console.log('Profile Picture URL', imageUrl);

        try {
          const updatedProfileData = {
            name: name || undefined,
            pronouns: pronouns || undefined,
            bio: bio || undefined,
            media: media || undefined,
            image_url: imageUrl,
          };

          const options = {
            where: {
              user_id,
            },
          };

          const [affectedRows] = await Profile.update(updatedProfileData, options);

          if (affectedRows > 0) {
            res.status(200).json({ message: 'Profile updated successfully' });
          } else {
            res.status(404).json({ message: 'Profile not found' });
          }
        } catch (updateError) {
          console.error('Error updating profile:', updateError);
          res.status(500).json({ message: 'Error updating profile' });
        }
    } else {
      try {
        const updatedProfileData = {
          name: name || undefined,
          pronouns: pronouns || undefined,
          bio: bio || undefined,
          media: media || undefined,
        };

        const options = {
          where: {
            user_id,
          },
        };

        const existingProfile = await Profile.findOne({
          where: {
            user_id,
          },
        });

        if (existingProfile && existingProfile.profilePictureURL) {
          updatedProfileData.profilePictureURL = existingProfile.profilePictureURL;
        }

        const [affectedRows] = await Profile.update(updatedProfileData, options);

        if (affectedRows > 0) {
          res.status(200).json({ message: 'Profile updated successfully' });
        } else {
          res.status(404).json({ message: 'Profile not found' });
        }
      } catch (updateError) {
        console.error('Error updating profile:', updateError);
        res.status(500).json({ message: 'Error updating profile' });
      }
    }  
  } catch (err) {
    console.error('Error:', err);
    res.status(400).json(err);
  }
});

// get and render profile
router.get('/:id', async (req, res) => {
  try {
    const profileData = await Profile.findByPk(req.params.id, {
      include: [{ model: User }],
    });
    const profile = profileData.get({ plain: true });
    res.render('profile', {
      ...profile,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;