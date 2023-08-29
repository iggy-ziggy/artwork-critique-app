const router = require('express').Router();
const { Artwork, User, Tag, ArtworkTag } = require('../../models');
const withAuth = require('../../utils/auth');
const path = require('path');
const firebaseAdmin = require('firebase-admin');

router.get('/', async (req, res) => {
  try {
    const artworkData = await Artwork.findAll({
      include: [{ model: User }, { model: Tag }],
    });
    res.status(200).json(artworkData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const artworkData = await Artwork.findByPk(req.params.id, 
      {
        include: [{ model: User }, { model: Tag }],
      });
      if (!artworkData) {
        res.status(404).json({ message: 'No artwork with that id!'});
        return;
      }
      res.status(200).json(artworkData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/upload', withAuth, async (req, res) => {
  try {
    console.log('Received upload request');
    const user_id = req.session.user_id;
    console.log('User ID:', user_id);

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
    const imageFile = req.files.image;
    console.log('Image file:', imageFile);

    const imageFileName = `${Date.now()}_${path.basename(imageFile.name)}`;
    const file = bucket.file(imageFileName);

    const uploadStream = file.createWriteStream({
      metadata: {
        contentType: imageFile.mimetype,
      },
    });

    uploadStream.on('error', (error) => {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Error uploading image' });
    });

    uploadStream.on('finish', async () => {
      console.log('Upload stream finished');
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${imageFileName}`;
      console.log('Image URL:', imageUrl);

      const currentDate = new Date(); // Get the current date and time
      
      const newArtwork = await Artwork.create({
        name: req.body.name,
        description: req.body.description,
        imageUrl: imageUrl,
        date_created: currentDate,
        user_id: user_id,
      });

      console.log('New artwork:', newArtwork);

      res.status(200).json(newArtwork);
    });

    uploadStream.end(imageFile.data);
  } catch (err) {
    console.error('Error in upload route:', err);
    res.status(400).json(err);
  }
});

module.exports = router;
