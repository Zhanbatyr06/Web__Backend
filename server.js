// server.js
const express = require('express');
const path = require('path');
const connectDB = require('./db');
const dotenv = require('dotenv');
const cors = require("cors");
const fileRoutes = require('./routes/fileRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// Подключаемся к базе данных только если не в тестовой среде
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: "https://web-backend-bbex.onrender.com" }));
app.use(cors());

app.use('/api', fileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home_page.html'));
});

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

// Запускаем сервер только если не в тестовой среде
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;