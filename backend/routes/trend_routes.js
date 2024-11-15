const express = require('express')
const router = express.Router()
const Trend = require('../models/trend')

router.get('/', async (req, res) => {

    try {
      const trends = await Trend.find().sort({last_activity: -1})
        res.json(trends)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.post('/new-trend', async (req, res) => {
    const trend = new Trend({
        name: req.body.name,
        image: req.body.image,
        last_activity: Date.now(),
        trend_score: 0
    })
    try {
        const newTrend = await trend.save()
        res.status(200)
    } catch (error) {
        res.status(400)
    }
})

module.exports = router