const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    creationPurchase: {
        type: Date,
        default: Date.now
    },
    total: {
        type: Number,
        required: true
    },
    provider: {
        type: String,
        required: true,
        maxLength: 50,
        trim: true
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

export const purchaseModel = mongoose.model('Purchase', purchaseSchema);