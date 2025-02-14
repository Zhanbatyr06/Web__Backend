// authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();
const pending2FA = {};

// Настройка транспортера для отправки писем через SMTP
// const transporter = nodemailer.createTransport({
//     service: 'gmail', // или другой почтовый сервис
//     auth: {
//         user: process.env.EMAIL_USER, // учётные данные отправителя (не данных пользователя)
//         pass: process.env.EMAIL_PASS  // пароль или app password
//     }
// });

// Логин (первый шаг, генерируется 2FA-код и отправляется на e-mail пользователя)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Поиск пользователя в базе данных
        const user = await User.findOne({ username });
        if (!user) {
            console.error('User not found');
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Проверка пароля
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error('Password does not match');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Генерация 6-значного кода (OTP)
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        // Сохраняем код и флаг верификации для данного пользователя (по его id)
        pending2FA[user._id] = { code: code, verified: false };

        // Настройка письма: отправляем код на e-mail, указанный у пользователя
        const mailOptions = {
            from: process.env.EMAIL_USER, // e-mail отправителя (учётные данные SMTP-сервера)
            to: user.email,               // e-mail получателя из базы данных
            subject: 'Ваш 2FA код',
            text: `Добрый день, ${user.username}!\n\nВаш код для двухфакторной аутентификации: ${code}\n\nЕсли вы не запрашивали вход, проигнорируйте это письмо.`
        };

        console.log(`Generated 2FA code for user ${user.username}: ${code}`);

        // Отправляем ответ клиенту, чтобы он перешёл к вводу кода
        res.status(200).json({ message: '2FA code sent. Please verify using the code sent to your email.', userId: user._id });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).json({ error: err.message });
    }
});

router.post('/verify-2fa', async (req, res) => {
    const { userId, code } = req.body;

    // Проверяем, что для данного пользователя была инициирована 2FA
    if (!pending2FA[userId]) {
        return res.status(400).json({ message: '2FA не была инициирована для этого пользователя' });
    }

    // Сравниваем введённый код с сохранённым кодом
    if (pending2FA[userId].code === code) {
        // Здесь можно отметить, что верификация прошла успешно или выдать JWT-токен
        pending2FA[userId].verified = true;
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token });
    } else {
        return res.status(400).json({ message: 'Неверный 2FA код' });
    }
});


module.exports = router;