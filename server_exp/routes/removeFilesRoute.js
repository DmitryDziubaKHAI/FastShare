const express = require('express');
const dbContext = require('../db/DbContext');

const router = express.Router();

// Маршрут для видалення файлів за паролем
router.delete('/files', async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    console.log("Received password for deletion:", `"${password}"`);

    try {
        // Спочатку перевіримо, чи є файли з таким паролем
        const checkResult = await dbContext.query(
            `SELECT COUNT(*) as count FROM files WHERE TRIM(password) = TRIM($1)`,
            [password.trim()]
        );
        
        const count = parseInt(checkResult.rows[0].count);
        
        if (count === 0) {
            return res.status(404).json({ message: 'No files found for this password' });
        }
        
        // Видаляємо файли з бази даних
        const deleteResult = await dbContext.query(
            `DELETE FROM files WHERE TRIM(password) = TRIM($1)`,
            [password.trim()]
        );
        
        console.log(`Deleted ${deleteResult.rowCount} files with password: ${password}`);
        
        res.status(200).json({ 
            message: 'Files deleted successfully',
            count: deleteResult.rowCount
        });
    } catch (error) {
        console.error('File deletion error:', error);
        res.status(500).json({ message: 'Error deleting files' });
    }
});

module.exports = router; 