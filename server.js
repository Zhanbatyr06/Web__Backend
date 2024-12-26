const express = require('express');
const path = require('path');
const connectDB = require('./db'); // Подключение к MongoDB
const app = express();
const PORT = 3000;

// Подключение к MongoDB
connectDB();

// Middleware для парсинга JSON
app.use(express.json());

// Статическая папка для обслуживания HTML, CSS и изображений
app.use(express.static(path.join(__dirname, 'public')));

// Подключение маршрутов
const fileRoutes = require('./routes'); 
app.use('/api', fileRoutes); 

// Маршрут для корневого URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home_page.html'));
});

// Пример дополнительного маршрута
app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});