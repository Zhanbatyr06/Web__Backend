const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const upload = require('../middleware/uploadMiddleware');
const fs = require('fs');
const path = require('path');

// Определение схемы и модели для файлов
const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    size: { type: String, required: true },
    path: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    access: { type: String, default: 'private' },
});
const File = mongoose.model('File', fileSchema);

// Маршрут для получения списка файлов (GET)
router.get('/files', async (req, res) => {
    try {
        const files = await File.find(); // Получение данных из коллекции
        res.json(files); // Отправка данных на клиент
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch files' });
    }
});
router.get('/download/:id', async (req, res) => {
    try {
        console.log('Download request for ID:', req.params.id);

        const file = await File.findById(req.params.id);
        if (!file) {
            console.error('File not found in database:', req.params.id);
            return res.status(404).json({ error: 'File not found' });
        }

        console.log('File found:', file);

        const filePath = path.join(__dirname, '..', file.path); // Убедись, что путь полный
        console.log('Full file path:', filePath);

        if (!fs.existsSync(filePath)) {
            console.error('File not found on disk:', filePath);
            return res.status(404).json({ error: 'File not found on disk' });
        }

        res.download(filePath, file.name, (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).json({ error: 'Failed to download file' });
            }
        });
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Маршрут для загрузки нового файла (POST)
router.post('/upload', upload.single('file'), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const { originalname, size } = req.file;
        const access = req.body.access || "private";

        const newFile = new File({
            name: originalname,
            size: size,
            path: filePath,
            access: access
        });

        const savedFile = await newFile.save();
        res.status(201).json({ message: 'File uploaded successfully!', file: savedFile });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload file', details: error.message});
    }
});

// Маршрут для удаления файла (DELETE)
router.delete('/files/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedFile = await File.findByIdAndDelete(id);
        if (!deletedFile) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Удаление файла с диска
        const filePath = deletedFile.path;
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file from disk:', err);
                return res.status(500).json({ error: 'Failed to delete file from disk' });
            }
            res.json({ message: 'File deleted successfully!', file: deletedFile });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete file' });
    }
});

// Маршрут для обновления данных о файле (PUT)
router.put('/files/:id', async (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;

    if (!newName) {
        return res.status(400).json({ error: 'New name is required!' });
    }

    try {
        const updatedFile = await File.findByIdAndUpdate(
            id,
            { name: newName },
            { new: true }
        );
        if (!updatedFile) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.json({ message: 'File updated successfully!', file: updatedFile });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update file' });
    }
});

module.exports = router;