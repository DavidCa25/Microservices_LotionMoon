const cron = require('node-cron');
const connectDB = require('./config/database.js');
const { calculateDailyPerformance } = require('./controllers/perfomanceController');
const express = require('express');

const app = express();

app.use(express.json());

connectDB();

app.use('/api/perfomance', require('./routes/performance'));

app.listen(3002, () => {
    console.log('Server is running on port 3002');
});

cron.schedule('0 */6 * * *', () => {
  calculateDailyPerformance();
});

