const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Tutorial', tutorialSchema);
