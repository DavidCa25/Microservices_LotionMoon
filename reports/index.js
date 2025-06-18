const connectDB = require('./config/database.js');
const express = require('express');

const app = express();

app.use(express.json());

connectDB();

app.use('/api/reports', require('./routes/reports'));

app.listen(3003, () => {
    console.log('Server is running on port 3003');
});

