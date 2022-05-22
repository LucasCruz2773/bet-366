const mongoose = require('../database');

const WalletSchema = new mongoose.Schema({
    id_user: {
        type: String,
        required: true,
        unique: true
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

const Wallet = mongoose.model('Wallet', WalletSchema);
module.exports = Wallet;