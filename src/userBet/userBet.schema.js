const mongoose = require('../database');

const UserBetSchema = new mongoose.Schema({
    id_option: {
        type: String,
        required: true
    },
    id_user: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const UserBet = mongoose.model('UserBet', UserBetSchema);
module.exports = UserBet;