const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    trend_id: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    sent_username: { 
        type: String,
        required: true
    },
    sent_profpic: {
        type: String,
        required: true
    }


})
module.exports = mongoose.model('Message',messageSchema)

