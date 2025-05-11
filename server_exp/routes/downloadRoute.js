// routes/downloadRoute.js
const express  = require('express');
const crypto   = require('crypto');
const db       = require('../db/DbContext');
const ensureAuth = require('./ensureAuth');

const router = express.Router();

let hasContentType = false;
(async () => {
  const q = await db.query(`
    SELECT 1 FROM information_schema.columns
     WHERE table_name='files' AND column_name='content_type' LIMIT 1
  `);
  hasContentType = q.rows.length > 0;
})();

const toBuf = b => typeof b === 'string' && b.startsWith('\\x')
  ? Buffer.from(b.slice(2), 'hex') : b;

const mimeGuess = name =>
  /\.pdf$/i.test(name)        ? 'application/pdf'  :
  /\.(png|apng)$/i.test(name) ? 'image/png'        :
  /\.(jpe?g)$/i.test(name)    ? 'image/jpeg'       :
  /\.(gif)$/i.test(name)      ? 'image/gif'        :
  /\.(bmp)$/i.test(name)      ? 'image/bmp'        :
  /\.(webp)$/i.test(name)     ? 'image/webp'       :
                                'application/octet-stream';

router.post('/download', ensureAuth, async (req, res) => {
  const { password } = req.body;
  if (!password?.trim())
    return res.status(400).json({ message: 'Password is required' });

  const pwdHash = crypto.createHash('sha256').update(password.trim()).digest('hex');

  const sql = hasContentType
    ? `SELECT id,filename,file,content_type FROM files WHERE password=$1 ORDER BY uploaded_at DESC`
    : `SELECT id,filename,file FROM files WHERE password=$1 ORDER BY uploaded_at DESC`;

  try {
    const { rows } = await db.query(sql, [pwdHash]);
    if (!rows.length) return res.status(404).json({ message: 'No files found' });

    if (rows.length === 1) {
      const f   = rows[0];
      const buf = toBuf(f.file);
      const mime = hasContentType && f.content_type ? f.content_type : mimeGuess(f.filename);
      res.setHeader('Content-Type', mime);
      const enc = encodeURIComponent(f.filename).replace(/['()]/g, c => '%' + c.charCodeAt(0).toString(16));
      res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${enc}`);
      return res.send(buf);
    }

    res.json(rows.map(r => ({ filename: r.filename, file: toBuf(r.file).toString('base64') })));
  } catch (e) {
    console.error('Download error:', e);
    res.status(500).json({ message: 'Error retrieving files' });
  }
});

module.exports = router;

