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
        responses: {
            type: String,
            default: "{}"
        },
        score: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

pairSessionSchema.methods.getResponse = function(i) {
    return JSON.parse(this.responses)[i];
};


module.exports = mongoose.model('PairSession', pairSessionSchema);
