const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Определение схемы и модели для файлов
const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    size: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
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

// Маршрут для загрузки нового файла (POST)
router.post('/upload', async (req, res) => {
    const { name, size } = req.body;
    if (!name || !size) {
        return res.status(400).json({ error: 'Name and size are required!' });
    }

    try {
        const newFile = new File({ name, size });
        await newFile.save();
        res.status(201).json({ message: 'File uploaded successfully!', file: newFile });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload file' });
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

// Маршрут для удаления файла (DELETE)
router.delete('/files/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedFile = await File.findByIdAndDelete(id);
        if (!deletedFile) {
            return res.status(404).json({ error: 'File not found' });
            
        }
        res.json({ message: 'File deleted successfully!', file: deletedFile });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete file' });
    }
});

module.exports = router;
