const express = require("express")

const Message = require('../models/message')
const router = express.Router()

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

router.post("/get_messages",function (req, res) {
    get_messages(req.body.trend_id, req.body.skip).then(messages => {
        res.json(messages)
    })
})

router.post("/new_message",function (req, res) {
    const user_id = req.body.user_id
    const trend_id = req.body.trend_id
    const message = req.body.message
    send_message(user_id, trend_id, message)
    res.sendStatus(200)
})

async function get_messages(trend_id,skip=0) {
    //Return all messages for a trend. Return only first 50 messages
    const messages = await Message.find({trend_id: trend_id}).skip(skip).exec()

    return {messages: messages, messages_count: messages.length}
}

async function send_message(user_id, trend_id, message) {
    //Send a message to a trend
    
    const newMessage = new Message({
        message: message,
        user_id: user_id,
        trend_id: trend_id
    })
    await newMessage.save()
}

module.exports = router