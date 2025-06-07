const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    stock: {
        type: Number,
        required: true,
        default: 0
    },	
    minimumStock: {
        type: Number,
        required: true,
        default: 0
    },
    maximumStock: {
        type: Number,
        required: true,
        default: 0
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Inventory', inventorySchema);