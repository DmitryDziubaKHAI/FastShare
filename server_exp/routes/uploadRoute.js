const express = require('express');
const multer  = require('multer');
const crypto  = require('crypto');
const db      = require('../db/DbContext');
const ensureAuth = require('./ensureAuth');

const router = express.Router();
const upload = multer();

router.post('/upload', ensureAuth, upload.array('files'), async (req, res) => {
  const { password } = req.body;
  const files = req.files;
  const userId = req.session.userId;

  if (!password?.trim() || !files?.length) {
    return res.status(400).json({ message: 'Password and files required' });
  }

  const pwdHash = crypto.createHash('sha256').update(password.trim()).digest('hex');

  try {
    const insertedIds = [];

    for (const file of files) {
      const fixedName = Buffer.from(file.originalname, 'latin1').toString('utf-8');
      const result = await db.query(`
        INSERT INTO files (user_id, password, filename, content_type, file)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, [userId, pwdHash, fixedName, file.mimetype, file.buffer]);

      insertedIds.push(result.rows[0].id);
    }

    res.status(201).json({ message: 'Files uploaded', fileIds: insertedIds });
  } catch (e) {
    console.error('Upload error:', e);
    res.status(500).json({ message: 'Failed to upload' });
  }
});

module.exports = router;



