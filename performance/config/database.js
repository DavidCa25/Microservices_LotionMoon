const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('DB Conectada');
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}
module.exports = connectDB;