const express = require('express');
const multer = require('multer');
const dbContext = require('../db/DbContext');

const router = express.Router();

// Використовуємо multer для обробки файлів (зберігаємо у пам'яті)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔹 Тепер маршрут має повний шлях `/upload`
router.post('/upload', upload.array('files'), async (req, res) => {
    const { password } = req.body;
    const files = req.files;

    if (!files || files.length === 0 || !password) {
        return res.status(400).json({ message: 'Files and password are required' });
    }

    try {
        for (const file of files) {
            const result = await dbContext.query(
                `INSERT INTO files (filename, file, password) VALUES ($1, $2, $3)`,
                [file.originalname, file.buffer, password.trim()]
            );
            
            console.log(`File ${file.originalname} uploaded, affected rows: ${result.rowCount}`);
        }

        res.status(201).json({ message: 'Files uploaded successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Error saving files to database' });
    }
});

module.exports = router;

