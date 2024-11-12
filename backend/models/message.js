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
    }
})
module.exports = mongoose.model('Message',messageSchema)

