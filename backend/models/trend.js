const mongoose = require('mongoose')

const trendSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    last_activity: {
        type: Date,
        required: false,
        default: Date.now
    },
    trend_score: {
        type: Number,
        required: false,
        default: 0
    },
    created_at: {
        type: Date,
        required: false,
        default: Date.now
    }
})
module.exports = mongoose.model('Trend',trendSchema)

