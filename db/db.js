// Requiring firebase (as our db)
require('dotenv').config();
const firebase = require('firebase');
// Importing our configuration to initialize our app
const config = require('../config/firebase.js');
// Creates and initializes a Firebase app instance. Pass options as param
const db = firebase.initializeApp(config.firebaseConfig);
module.exports = db;