const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Добавление middleware для парсинга JSON
app.use(express.json());  // Добавьте эту строку

// Настройка статической папки для обслуживания HTML, CSS и изображений
app.use(express.static(path.join(__dirname, 'public')));

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Маршрут для получения списка файлов (GET)
app.get('/files', (req, res) => {
    const files = [
        { id: 1, name: 'file1.txt', size: '1MB' },
        { id: 2, name: 'file2.jpg', size: '2MB' },
    ];
    res.json(files);
});

// Маршрут для загрузки нового файла (POST)
app.post('/upload', (req, res) => {
    const { filename } = req.body;
    if (filename) {
        res.status(201).json({ message: `File '${filename}' uploaded successfully!` });
    } else {
        res.status(400).json({ error: 'Filename is required!' });
    }
});

// Маршрут для обновления данных о файле (PUT)
app.put('/files/:id', (req, res) => {
    const { id } = req.params;
    const { newName } = req.body;  // Обрабатываем новое имя файла из тела запроса

    if (newName) {
        res.json({ message: `File with ID ${id} updated to '${newName}'` });
    } else {
        res.status(400).json({ error: 'New name is required!' });
    }
});

// Маршрут для удаления файла (DELETE)
app.delete('/files/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `File with ID ${id} deleted.` });
});

// Маршрут для корневого URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home_page.html'));
});
