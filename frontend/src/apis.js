async function get_trends() {
    //Return Trends as a list of dictionaries 
    //Example Data: [{name: "name", image: "image", last_activity: 123, trend_score: 0}]
    const response= await fetch("http://localhost:5000/api/trends")
    const data = await response.json()
    console.log(data)
    return data
}

async function listen_to_messages(trend_id, receive_listener) {

    //Listens to messages for a trend
    //Input: 
    //trend_id - ID of the trend
    //receive_listener - A function that will be called when new messages are detected. Receives a parameter containing the list of messages
    //Example Data: [{message: "Hello", user_id: xxxxx, trend_id: yyyyy}]

    var last_message_count = 0
    var last_messages = []
    console.log("Listening to messages for trend: " + trend_id) 
    async function get_new_messages() {
        
        var messages = await fetch("http://localhost:5000/api/messaging/get_messages", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({trend_id: trend_id, skip: last_message_count},
            )
        })

       messages = await messages.json()
       var new_message_count = messages.messages_count
       if (new_message_count > 0) {
           last_message_count += new_message_count
           for (var i = 0; i < new_message_count; i++) {
               last_messages.push(messages.messages[i])
           }

           receive_listener(last_messages)
       }
       setTimeout(get_new_messages, 2000)
       
    }
    
    get_new_messages()
}

async function add_new_message(message, user_id, trend_id) {
    const messages = await fetch("http://localhost:5000/api/messaging/new_message", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({trend_id: trend_id, message: message, user_id: user_id},
        )
    })
}



// setTimeout(function() {
//     console.log("called")
//     add_new_message("Hello", "123", "67343e035ce5a86d0cd3e934")
// },5000)

// add_new_message("Hello", "123", "67343e035ce5a86d0cd3e934")
// console.log("Stored")

// function new_messages_found(messages) {
//     console.log(messages)
// }

// listen_to_messages("67343e035ce5a86d0cd3e934", new_messages_found)

export {get_trends, listen_to_messages, add_new_message}