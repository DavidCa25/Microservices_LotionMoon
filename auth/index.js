const express = require('express');
const connectDB = require('./config/database.js');

const app = express();

connectDB();

app.use(express.json());

app.use('/api/auth', require('./router/auth'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});