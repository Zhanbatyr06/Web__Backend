const File = require('../models/File');
const User = require('../models/User');

// Загрузка файла

// Обработчик загрузки файла
const uploadFile = async (req, res) => {
    try {
        const { access } = req.body; // Доступ (public/private)
        const filePath = req.file.path; // Путь к сохраненному файлу

        // Создаем запись о файле в базе данных
        const newFile = new File({
            name: req.file.originalname,
            size: req.file.size,
            path: filePath,
            owner: req.userId || 'defaultOwner', // Здесь используйте ID пользователя из авторизации
            access: access || 'private'
        });

        await newFile.save();

        res.status(201).json({ message: 'File uploaded successfully', file: newFile });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload file' });
    }
};


// Получение списка файлов
const getFiles = async (req, res) => {
    try {
        const files = await File.find().populate('owner', 'name email');
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch files' });
    }
};

// Удаление файла
const deleteFile = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedFile = await File.findByIdAndDelete(id);
        if (!deletedFile) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.json({ message: 'File deleted successfully', file: deletedFile });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete file' });
    }
};

module.exports = {
    uploadFile,
    getFiles,
    deleteFile,
};
