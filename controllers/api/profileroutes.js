const router = require('express').Router();
const { User, Profile } = require('../../models');
const withAuth = require('../../utils/auth');
const path = require('path');
const firebaseAdmin = require('firebase-admin'); // Import Firebase Admin SDK

// Initialize Firebase Admin SDK
const serviceAccount = {
  "type": process.env.FIREBASE_TYPE,
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = firebaseAdmin.storage().bucket();

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

router.post('/update', withAuth, async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const { name, pronouns, bio, media } = req.body;

    if (req.file) {
      const profilePicture = req.file;
      const profilePictureName = `${user_id}_${profilePicture.originalname}`;
      const file = bucket.file(`profilePictures/${profilePictureName}`);

      const uploadStream = file.createWriteStream({
        metadata: {
          contentType: profilePicture.mimetype,
        },
      });

      uploadStream.on('error', (error) => {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Error uploading image' });
      });

      uploadStream.on('finish', async () => {
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${profilePictureName}`;

        try {
          const updatedProfileData = {
            name: name || undefined,
            pronouns: pronouns || undefined,
            bio: bio || undefined,
            media: media || undefined,
            profilePictureURL: imageUrl,
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
      });

      uploadStream.end(profilePicture.data);
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