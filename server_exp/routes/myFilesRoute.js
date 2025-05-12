const express = require('express');
const db = require('../db/DbContext');
const ensureAuth = require('./ensureAuth');

const router = express.Router();

router.get('/my-files', ensureAuth, async (req, res) => {
  const userId = req.session.userId;

  try {
    const { rows } = await db.query(`
      SELECT id, filename, uploaded_at
      FROM files
      WHERE user_id = $1
      ORDER BY uploaded_at DESC
    `, [userId]);

    res.json({ files: rows });
  } catch (err) {
    console.error('Fetch my files error:', err);
    res.status(500).json({ message: 'Failed to fetch files' });
  }
});

module.exports = router;

