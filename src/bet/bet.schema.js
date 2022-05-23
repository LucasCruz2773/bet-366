const { Schema } = require('mongoose');
const mongoose = require('../database');

const BetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    id_user: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    finalizedAt: {
        type: Date,
        default: null,
        required: false
    },
    options: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Option'
        }
    ]
});

const Bet = mongoose.model('Bet', BetSchema);
module.exports = Bet;