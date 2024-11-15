const jwt = require('jsonwebtoken');
const secretKey = 'itztrending';

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    const decodedToken = jwt.verify(token, secretKey);
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Authentication failed try Again' });
  }
};

