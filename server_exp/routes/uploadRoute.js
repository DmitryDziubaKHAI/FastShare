// routes/uploadRoute.js
const express  = require('express');
const multer   = require('multer');
const crypto   = require('crypto');
const db       = require('../db/DbContext');
const ensureAuth = require('./ensureAuth');

const router  = express.Router();
const upload  = multer({ storage: multer.memoryStorage() });

/* визначаємо наявність content_type лише раз */
let hasContentType = false;
(async () => {
  const q = await db.query(`
    SELECT 1 FROM information_schema.columns
     WHERE table_name='files' AND column_name='content_type' LIMIT 1
  `);
  hasContentType = q.rows.length > 0;
})();

router.post('/upload', ensureAuth, upload.array('files'), async (req, res) => {
  const { password } = req.body;
  const files = req.files ?? [];

  if (!files.length || !password?.trim())
    return res.status(400).json({ message: 'Files and password required' });

  const pwdHash = crypto.createHash('sha256').update(password.trim()).digest('hex');

  try {
    for (const f of files) {
      const filename = Buffer.from(f.originalname, 'latin1').toString('utf8');

      const sql  = hasContentType
        ? `INSERT INTO files
           (filename,file,password,user_id,content_type)
           VALUES ($1,$2,$3,$4,$5)`
        : `INSERT INTO files
           (filename,file,password,user_id)
           VALUES ($1,$2,$3,$4)`;

      const args = hasContentType
        ? [filename, f.buffer, pwdHash, req.userId, f.mimetype]
        : [filename, f.buffer, pwdHash, req.userId];

      await db.query(sql, args);
    }
    res.status(201).json({ message: 'Files uploaded successfully' });
  } catch (e) {
    console.error('Upload error:', e);
    res.status(500).json({ message: 'Database error' });
  }
});

module.exports = router;
