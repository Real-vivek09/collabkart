const admin = require('firebase-admin');
require('dotenv').config();

try {
  const serviceAccount = require('../serviceAccountKey.json');

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('🔥 Firebase Admin SDK initialized.');
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error.message);
  console.log('Please ensure serviceAccountKey.json is in the backend root and is valid.');
}

module.exports = admin;
