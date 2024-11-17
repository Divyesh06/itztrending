const express = require("express")
const authenticate_request = require("../authenticate_request")
const Message = require('../models/message')
const User = require('../models/user')
const router = express.Router()
const Trend = require('../models/trend')
//TODO: Implement Websockets later

// async function listen_to_messages(ws) {

//     ws.on('open', () => {
//         console.log('Connected to WebSocket server');
//       });

//     ws.on('message', (message) => {
//         message = JSON.parse(message)
//         switch (message.type) {
//             case 'get_messages':
//                 client.send(JSON.stringify({"trend_id": "get_messages","messages": get_messages(message.trend_id)}))
//                 break;
//             case 'send_message':
//                 send_message(message.user_id, message.trend_id, message.message)
//                 //Send message to all clients
//                 ws.clients.forEach(client => {
//                     client.send(JSON.stringify({"type": "get_messages","messages": get_messages(message.trend_id)}))
//                 });
//                 break;
//         }
//       });
// }

router.post("/get_messages", function (req, res) {
    get_messages(req.body.trend_id, req.body.skip).then(messages => {
        res.json(messages)
    })
})

router.post("/new_message", authenticate_request, async function (req, res) {
    const user_id = req.userData.userId
    const trend_id = req.body.trend_id
    const message = req.body.message
    const user = await User.findById(user_id)
    const username = user.username
    const profpic = user.profpic
    send_message(user_id, trend_id, message, username, profpic)
    res.sendStatus(200)
})

async function get_messages(trend_id, skip = 0) {
    const messages = await Message.find({ trend_id: trend_id }).skip(skip).exec()

    return { messages: messages, messages_count: messages.length }
}

async function send_message(user_id, trend_id, message, username, profpic) {

    const newMessage = new Message({
        message: message,
        user_id: user_id,
        trend_id: trend_id,
        sent_profpic: profpic,
        sent_username: username
    })
    
    const trend = await Trend.findById(trend_id)
    trend.trend_score += 10
    trend.save()
    
    await newMessage.save()
}

module.exports = router