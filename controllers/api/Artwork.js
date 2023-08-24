const router = require('express').Router();
const { Artwork } = require('../../models');
const withAuth = require('../../utils/auth');
const path = require('path');
const firebaseAdmin = require('firebase-admin');

router.post('/', withAuth, async (req, res) => {
  try {
    const user_id = req.session.user_id;

    const imageFile = req.files.image; // Assuming you're using a file upload library like 'express-fileupload'

    // Initialize Firebase Admin SDK
    const serviceAccount = require('path/to/your/serviceAccountKey.json');
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      storageBucket: FIREBASE_STORAGE_BUCKET, // Replace with your Firebase Storage bucket URL
    });

    const bucket = firebaseAdmin.storage().bucket();
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
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${imageFileName}`;

      const currentDate = new Date(); // Get the current date and time
      
      const newArtwork = await Artwork.create({
        name: req.body.name,
        description: req.body.description,
        imageUrl: imageUrl,
        date_created: currentDate,
        user_id: user_id,
      });

      res.status(200).json(newArtwork);
    });

    uploadStream.end(imageFile.data);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
