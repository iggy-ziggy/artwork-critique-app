const firebaseStorage = require('../config/firebase');  // reference to our db 
require("firebase/storage"); // must be required for this to work
const storage = firebaseStorage.storage().ref(); // create a reference to storage
global.XMLHttpRequest = require("xhr2"); // must be used to avoid bug
// Add Image to Storage and return the file path
const addImage = async (req, res) => {
    console.log('addImage function is running'); 
    try {
        // Grab the file
        const file = req.file;
        // Format the filename
        if (!file) {
            console.log('No file uploaded.');
            return res.status(400).send('No file uploaded.');
        }
        const timestamp = Date.now();
        const name = file.originalname.split(".")[0];
        const type = file.originalname.split(".")[1];
        const fileName = `${name}_${timestamp}.${type}`;
         // Step 1. Create reference for file name in cloud storage 
        const imageRef = storage.child(fileName);
        // Step 2. Upload the file in the bucket storage
        console.log('Before uploading the image');
        const snapshot = await imageRef.put(file.buffer);
        console.log('Image uploaded');
        // Step 3. Grab the public url
        console.log('Before getting the download URL');
        const downloadURL = await snapshot.ref.getDownloadURL();
        console.log('Download URL:', downloadURL);
        
        return downloadURL;
     }  catch (error) {
        console.error('Error during image upload:', error);
        throw error;
    }
}
module.exports = {
    addImage
}