const { Schema } = require('mongoose');
const mongoose = require('../database');

const OptionSchema = new mongoose.Schema({
    id_bet: {
        type: Schema.Types.ObjectId,
        ref: 'Bet',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    odd: {
        type: Number,
        required: true
    },
    correct: {
        type: Boolean,
        required: true
    }
});

const Option = mongoose.model('Option', OptionSchema);
module.exports = Option;