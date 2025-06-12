const cron = require('node-cron');
const { calculateDailyPerformance } = require('./controllers/perfomanceController');

cron.schedule('* * * * *', () => {
  calculateDailyPerformance();
});

