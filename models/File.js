const mongoose = require('mongoose');
const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    size: { type: Number, required: true }, // Размер в байтах
    path: { type: String, required: true }, // Путь к файлу
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Владелец
    access: { 
        type: String, 
        enum: ['public', 'private'], 
        default: 'private',
        required: true
    }, // Доступ: публичный или приватный
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('File', fileSchema);
