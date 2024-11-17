const mongoose = require('mongoose')

const pollSchema = new mongoose.Schema({
    trend_id: {
        type: String,
        required: true
    },
    options: {
        type: Array,
        required: true
    },
    option1_count: {
        type: Number,
        required: true,
        default: 0
    },
    option2_count: {
        type: Number,
        required: true,
        default: 0
    },
    image: {
        type: String,
        required: true, 
    },
    vote_count: {
        type: Number,
        required: true,
        default: 0
    },
    voters: {
        type: Array,
        required: true,
        default: []
    },
    question: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model('Poll',messageSchema)

