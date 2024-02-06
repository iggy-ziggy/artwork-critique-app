const router = require('express').Router();
const multer = require('multer');
const { User, Profile, Artwork } = require('../../models');
const withAuth = require('../../utils/auth');
const path = require('path');
const { addImage } = require('../../utils/addImage');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// get and render profile of another user
router.get('/:id', withAuth, async (req, res) => {
  try {
    const profileData = await User.findByPk(req.params.id, {
      include: [{ model: Profile }, { model: Artwork }],
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
      include: [{ model: Profile }, { model: Artwork }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true,
    });
    console.log('User Data:', user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//render update profile form
// I keep getting sequelizeloadingerror whenever this doesn't have an additional endpoint - for now, let's leave it like this - it's only rendering, shouldn't cause problems
router.get('/update/new', withAuth, async (req, res) => {
  try {
    // Fetch the user's profile data
    const userData = await User.findByPk(req.session.user_id, {
      include: [{ model: Profile }],
    });

    // Check if the user has a profile
    if (userData.Profile) {
      const user = userData.get({ plain: true });
      console.log('User Data:', userData);
      // Render the updateprofile.handlebars template with the profile data
      res.render('updateprofile', {
        ...user,
      });
    } else {
      // If the user doesn't have a profile, render the form without data
      res.render('updateprofile');
    }
  } catch (err) {
    console.log(err);
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/update/profile-created', async (req, res) => {
  res.render('profile-created');
});

// update profile

router.post('/', withAuth, upload.single('profilePicture'),
  async (req, res) => {
    try {
      console.log('Received Update request');
      const user_id = req.session.user_id;
      console.log('User ID:', user_id);

      const { name, pronouns, bio, media } = req.body;
      const profilePicture = req.file;

      let imageUrl;

      if (profilePicture) {
        imageUrl = await addImage(req, res);

        if (!imageUrl) {
          console.error('Download URL is undefined');

          return res.status(500).json({ message: 'Download URL is undefined' });
        }
      }

      // Check if a profile exists for the user
      const existingProfile = await Profile.findOne({
        where: {
          user_id,
        },
      });

      if (!existingProfile) {
        // If no profile exists, create a new one
        const profileData = {
          name,
          pronouns,
          bio,
          media,
          user_id,
        };

        if (imageUrl) {
          console.log('Profile Picture URL', imageUrl);
          profileData.image_url = imageUrl;
        }

        const profile = await Profile.create(profileData);

        console.log(profile);
        return res
          .status(200)
          .json({
            message: 'Profile created successfully',
            profile: profile,
            downloadURL: imageUrl,
          });
      } else {
        // Profile exists, update it
        const profileData = {
          name: name || undefined,
          pronouns: pronouns || undefined,
          bio: bio || undefined,
          media: media || undefined,
          image_url: imageUrl || undefined,
        };

        const options = {
          where: {
            user_id,
          },
        };

        const profile = await Profile.update(profileData, options);
        res.status(200).json(profile);
      }
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ message: 'Error updating profile' });
    }
  }
);


module.exports = router;
