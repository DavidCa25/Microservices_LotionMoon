const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
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

const Client = mongoose.model('Client', ClientSchema);
