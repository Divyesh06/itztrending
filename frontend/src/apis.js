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
    const messages = await fetch("http://localhost:5000/api/messaging/get_messages", {
        body: JSON.stringify({trend_id: trend_id})
    })

   // messages.last_message_count = messages.messages

}

export {get_trends}