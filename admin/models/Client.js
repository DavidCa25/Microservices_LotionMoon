const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    clientEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /.+\@.+\..+/
    }
    // Add other fields as necessary
}, {
    timestamps: true
});

module.exports = mongoose.model('Client', ClientSchema);
