const express = require('express');
const path = require('path');
const connectDB = require('./db'); 
const dotenv = require('dotenv');
const app = express();
const PORT = 3000;
dotenv.config();

connectDB();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const fileRoutes = require('./routes'); 
app.use('/api', fileRoutes); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home_page.html'));
});

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

console.log(process.env.PORT);
console.log(process.env.MONGO_URI);
console.log(process.env.JWT_SECRET);
