const express = require("express")
const authenticate_request = require("../authenticate_request")
const Poll = require('../models/poll')
const User = require('../models/user')
const router = express.Router()

router.post("/new_poll", authenticate_request, async function (req, res) {
    const trend_id = req.body.trend_id
    const question = req.body.question
    const options = req.body.options
    const poll = new Poll({trend_id, question, options})
    await poll.save()
})

router.get("/get_polls", async function (req, res) {
    const polls = await Poll.find().sort({vote_count: -1})
    res.json(polls)
})

router.get("/get_trend_polls", async function (req, res) {
    const trend_id = req.body.trend_id
    const polls = await Poll.find({trend_id}).sort({vote_count: -1})
    res.json(polls)
})

router.post("/vote", authenticate_request, async function (req, res) {

    const vote = req.body.vote
    const user = await User.findById(req.userData.userId)
    const poll_id = req.body.poll_id
    const poll = await Poll.findById(poll_id)
    poll.vote_count += 1
    if (vote == 1) {
        poll.option1_count += 1
    }
    else {
        poll.option2_count += 1
    }

    poll.voters.push(user.username)
    await poll.save()
    res.sendStatus(200)
})