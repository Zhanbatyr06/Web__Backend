const mongoose = require('mongoose');
const activitySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: ['upload', 'download', 'delete'], required: true },
    file: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', activitySchema);
