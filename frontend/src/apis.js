async function get_trends() {
    //Return Trends as a list of dictionaries 
    //Example Data: [{name: "name", image: "image", last_activity: 123, trend_score: 0}]
    const response= await fetch("http://localhost:5000/api/trends")
    const data = await response.json()
    console.log(data)
    return data
}

export {get_trends}