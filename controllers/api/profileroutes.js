const router = require('express').Router();
const multer = require('multer');
const { User, Profile, Artwork } = require('../../models');
const withAuth = require('../../utils/auth');
const path = require('path');
const { addImage } = require('../../utils/addImage');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');


// get and render profile of another user
router.get('/:id', withAuth, async (req, res) => {
  try {
    const profileData = await User.findByPk(req.params.id, {
      include: [{ model: Profile }, { model: Artwork}],
    });
    const profile = profileData.get({ plain: true });
    res.render('profile', {
      ...profile,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// render current user profile
// Use withAuth middleware to prevent access to route
router.get('/', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Profile }, { model: Artwork}],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//render update profile form
// I keep getting sequelizeloadingerror whenever this doesn't have an additional endpoint - for now, let's leave it like this - it's only rendering, shouldn't cause problems
router.get('/update/new', withAuth, async (req, res) => {
  res.render('updateprofile');
});

// update profile
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

module.exports = router;