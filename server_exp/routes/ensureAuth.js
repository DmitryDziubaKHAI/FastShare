// middleware/ensureAuth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

/**
 * Перевіряє cookie authToken.
 * Якщо токен невалідний — одразу стирає cookie, повертає 401.
 */
module.exports = function ensureAuth (req, res, next) {
  const token = req.cookies?.authToken;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const { userId } = jwt.verify(token, JWT_SECRET);
    if (!userId) throw new Error('no userId');
    req.userId = userId;
    next();
  } catch {
    res.clearCookie('authToken', { sameSite: 'lax' });
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
