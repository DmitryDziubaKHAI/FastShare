const express = require('express');
const crypto  = require('crypto');
const db      = require('../db/DbContext');
const ensureAuth = require('./ensureAuth');

const router = express.Router();

router.delete('/files', ensureAuth, async (req, res) => {
  const { password } = req.body;
  if (!password?.trim()) {
    return res.status(400).json({ message: 'Password is required' });
  }

  const pwdHash = crypto.createHash('sha256').update(password.trim()).digest('hex');
  const userId = req.session.userId;

  try {
    const result = await db.query(
        'DELETE FROM files WHERE password = $1 AND user_id = $2 RETURNING id',
        [pwdHash, userId]
    );

    res.json({ message: 'Files deleted', count: result.rowCount });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Failed to delete files' });
  }
});

module.exports = router;
