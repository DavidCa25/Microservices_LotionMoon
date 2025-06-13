const cron = require('node-cron');
const connectDB = require('./config/database.js');
const { calculateDailyPerformance } = require('./controllers/perfomanceController');

connectDB();

cron.schedule('* * * * *', () => {
  calculateDailyPerformance();
});

