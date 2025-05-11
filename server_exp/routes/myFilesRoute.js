// routes/myFilesRoute.js
const express  = require('express');
const db       = require('../db/DbContext');
const ensureAuth = require('./ensureAuth');

const router = express.Router();

/* GET /my-files -> список файлів поточного користувача */
router.get('/my-files', ensureAuth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, filename, uploaded_at
         FROM files
        WHERE user_id = $1
        ORDER BY uploaded_at DESC`,
      [req.userId]
    );
    res.json({ files: rows });
  } catch (e) {
    console.error('Fetch files error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
