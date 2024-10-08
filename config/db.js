const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect('mongodb://localhost:27017/ecommerce');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error: ', error);
        process.exit(1)
    }
};

module.exports = connectDB;