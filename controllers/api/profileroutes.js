const router = require('express').Router();
const { User, Profile } = require('../../models');
const withAuth = require('../../utils/auth');
const path = require('path');
const firebaseAdmin = require('firebase-admin');

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

router.post('/api/profile/update', withAuth, async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const { name, pronouns, bio, media, profilePictureURL } = req.body;


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

    if (profilePicture) {
    const profilePicture = req.file;
    const profilePictureName = profilePicture.originalname;
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
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${imageFileName}`;

      const currentDate = new Date(); // Get the current date and time
      
      const updatedProfile = await Profile.updateOne({
        { user_id},
        {
        name: req.body.name,
        pronouns: req.body.pronouns,
        bio: req.body.bio,
        media: req.body.media,
        profilePictureURL,
        }
      });

      res.status(200).json(updatedProfile);
    });

    uploadStream.end(profilePicture.data);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
