const express = require('express');
const connectDB = require('./config/database.js');

const app = express();

connectDB();

app.use(express.json());

app.use('/api/admin', require('./routes/admin'));

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});