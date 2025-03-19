const express = require('express');
const dbContext = require('../db/DbContext');

const router = express.Router();

router.post('/download', async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    console.log("Received password:", `"${password}"`); 

    try {
        const result = await dbContext.query(
            `SELECT filename, file FROM files WHERE TRIM(password) = TRIM($1)`,
            [password.trim()]
        );

        console.log("Files found in DB:", result.rows);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'No files found for this password' });
        }

        if (result.rows.length > 1) {
            return res.json(result.rows.map(file => ({
                filename: file.filename,
                file: file.file.toString('base64')
            })));
        } else {
            // 🔹 Якщо один файл – завантажуємо його окремо
            const file = result.rows[0];
            res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
            res.setHeader('Content-Type', 'application/octet-stream');
            res.send(Buffer.from(file.file));
        }
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: 'Error retrieving files' });
    }
});

module.exports = router;
