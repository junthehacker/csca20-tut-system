const mongoose = require('mongoose');

const pairSessionSchema = new mongoose.Schema(
    {
        username1: {
            type: String,
            required: true,
        },
        username2: {
            type: String,
            required: true,
        },
        tutorial: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Tutorial',
            required: true,
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('PairSession', pairSessionSchema);
