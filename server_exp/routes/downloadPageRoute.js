const express  = require('express');
const crypto   = require('crypto');
const db       = require('../db/DbContext');

const router = express.Router();

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

const getFile = async (id) => {
  return (await db.query('SELECT * FROM files WHERE id = $1', [id || 0])).rows[0]
}

router.get('/downloadPage', async (req, res) => {
  const id = req.query.id;
  const file = await getFile(id);
  if(!file) {
    res.status(404).json({ message: 'File not found' })
    return;
  }
  res.status(201).json({filename: file['filename']});
});

router.post('/downloadPage', async (req, res) => {
  const {password, id, validate} = req.body;
  const file = await getFile(id);
  if(!file) {
    res.status(404).json({ message: 'File not found' })
    return;
  }
  const pwdHash = crypto.createHash('sha256').update((password || '').trim()).digest('hex');
  if(file['password'] !== pwdHash) {
    res.status(403).json({message: 'Wrong password'});
    return;
  }
  if(validate) {
    res.status(201).json({status: 'OK'});
    return;
  }

  try {
    const buf = toBuf(file.file);
    const mime = file.content_type ? file.content_type : mimeGuess(file.filename);
    res.setHeader('Content-Type', mime);
    const enc = encodeURIComponent(file.filename).replace(/['()]/g, c => '%' + c.charCodeAt(0).toString(16));
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${enc}`);
    return res.send(buf);
  } catch (e) {
    console.error('Download error:', e);
    res.status(500).json({ message: 'Error retrieving files' });
  }
});

module.exports = router;
