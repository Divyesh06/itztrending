async function post_data_to_server(url, data, return_json = true) {
    const response = await fetch(`/api${url}`, {
        method: "POST",
        headers: {
            
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify(data)
    })
    if (return_json == false) {
        return response
    }
    return await response.json()
}

async function get_trends() {
    //Return Trends as a list of dictionaries 
    //Example Data: [{name: "name", image: "image", last_activity: 123, trend_score: 0}]
    const response= await fetch("/api/trends")
    const data = await response.json()
    return data
}

async function get_hot_trends() {
    //Return Trends as a list of dictionaries 
    //Example Data: [{name: "name", image: "image", last_activity: 123, trend_score: 0}]
    const response= await fetch("/api/trends/hot")
    const data = await response.json()
    return data
}

async function search_trends(q) {
    //Return Trends as a list of dictionaries
    //Example Data: [{name: "name", image: "image", last_activity: 123, trend_score: 0}]
    const response= await fetch(`/api/trends/search?q=${q}`)
    const data = await response.json()
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
        console.log("Getting new messages for:", trend_id)
       var messages = await post_data_to_server("/messaging/get_messages", {trend_id: trend_id, skip: last_message_count})
       //messages = await messages.json()
       var new_message_count = messages.messages_count
       if (new_message_count > 0) {
           last_message_count += new_message_count
           for (var i = 0; i < new_message_count; i++) {
               last_messages.push(messages.messages[i])
           }

           receive_listener(last_messages)
       }
       if (window.location.pathname == "/trend/" + trend_id) {
        setTimeout(get_new_messages, 1000)
       }
       
       
    }
    
    get_new_messages()
}

async function add_new_message(message, trend_id) {

    post_data_to_server("/messaging/new_message", {trend_id: trend_id, message: message})
}

async function vote_on_poll(poll_id, vote) {
    post_data_to_server("/polls/vote", {poll_id: poll_id, vote: vote})
}

async function create_poll(trend_id, question, option1, option2) {
    post_data_to_server("/polls/new_poll", {trend_id: trend_id, question: question, options: [option1, option2]})
}

async function get_polls() {
    const polls = await post_data_to_server("/polls/get_polls")
    return polls
}

async function get_trend_polls(trend_id) {
    const polls = await post_data_to_server("/polls/get_trend_polls", {trend_id: trend_id})
    return polls
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

//set_username_and_profpic("Divyesh", null)

export {get_trends, listen_to_messages, add_new_message, post_data_to_server, vote_on_poll, get_hot_trends, search_trends, create_poll, get_polls, get_trend_polls}