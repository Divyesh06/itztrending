const express = require('express')
const router = express.Router()
const Trend = require('../models/trend')
const { create } = require('../models/message')

router.get('/', async (req, res) => {

    try {
      const trends = await Trend.find().sort({created_at: -1, trend_score: -1}).limit(50)
        res.json(trends)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.get("/hot", async function (req, res) {
    try {
        const hotTrends = await Trend.find().sort({trend_score: -1}).limit(50)
        res.json(hotTrends)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

async function get_search_results(q, limit=50) {
    const results = await Trend.aggregate().search({
        index: "default",
        text: {
            query: q,
            path: ['name']
        }
    }).project({name: 1, image: 1, last_activity: 1, trend_score: 1, score: { $meta: 'searchScore' }}).sort({score: -1}).limit(limit)
    return results
}

router.get("/search", async function (req, res) {
    const results = await get_search_results(req.query.q)
    
    res.json(results)
}
   
)


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

//Create a function that sets the created_at to last_activity

