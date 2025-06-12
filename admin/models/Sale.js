const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    creationDate: {
        type: Date,
        default: Date.now
    },
    total: {
        type: Number,
        required: true
    },
    clientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    employeeID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    products: [{
        inventoryID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventory',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
    }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Sale', saleSchema);