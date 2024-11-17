const express = require("express")
const authenticate_request = require("../authenticate_request")
const Poll = require('../models/poll')
const User = require('../models/user')
const Trend = require('../models/trend')
const router = express.Router()

router.post("/new_poll", authenticate_request, async function (req, res) {
    const trend_id = req.body.trend_id
    const question = req.body.question
    const options = req.body.options
    const trend = await Trend.findById(trend_id)
    const image = trend.image
    const poll = new Poll({trend_id, question, options, image})
    await poll.save()
})

router.post("/get_polls", authenticate_request,async function (req, res) {
    const polls = await Poll.find({voters: {$ne: req.userData.userId}}).sort({vote_count: -1})
    res.json(polls)
})

router.post("/get_trend_polls", authenticate_request, async function (req, res) {
    const trend_id = req.body.trend_id
    const polls = await Poll.find({trend_id, voters: {$ne: req.userData.userId}}).sort({vote_count: -1})
    res.json(polls)
})

router.post("/vote", authenticate_request, async function (req, res) {

    const vote = req.body.vote
    
    const poll_id = req.body.poll_id
    const poll = await Poll.findById(poll_id)
    poll.vote_count += 1
    if (vote == 1) {
        poll.option1_count += 1
    }
    else {
        poll.option2_count += 1
    }

    poll.voters.push(req.userData.userId)
    await poll.save()
    res.sendStatus(200)
})

module.exports = router