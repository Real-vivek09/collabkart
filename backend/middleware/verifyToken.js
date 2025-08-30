const admin = require('firebase-admin');
const path = require('path');

// Firebase Admin SDK ke JSON file ka path define karo
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const verifyToken = async (req, res, next) => {
  // Authorization header me Bearer token expect karte hain
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Firebase token verify karo
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // User info request object me attach karo
    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
