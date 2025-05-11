// routes/removeFilesRoute.js
const express  = require('express');
const crypto   = require('crypto');
const db       = require('../db/DbContext');
const ensureAuth = require('./ensureAuth');

const router = express.Router();

router.delete('/files', ensureAuth, async (req, res) => {
  const { password } = req.body;
  if (!password?.trim())
    return res.status(400).json({ message: 'Password required' });

  const pwdHash = crypto.createHash('sha256').update(password.trim()).digest('hex');

  try {
    const { rowCount } = await db.query('DELETE FROM files WHERE password=$1', [pwdHash]);
    res.json({ count: rowCount });
  } catch (e) {
    console.error('Delete error:', e);
    res.status(500).json({ message: 'Failed to delete files' });
  }
});

module.exports = router;
