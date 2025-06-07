const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { 
        required: true,
        type: String,
        trim: true,
        unique: true
    },
    productDescription: { 
        type: String,
        trim: true
    },
    price: {
        required: true,
        type: Number
    },
    brand: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Product', productSchema);