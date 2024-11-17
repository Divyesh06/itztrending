const cron = require('node-cron');
const Trend = require('./models/trend');
const { get } = require('http');
// Schedule the task to run every day at midnight
cron.schedule('0 0 * * *', get_trends);


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

async function get_trends() {
    console.log('Running cron job...')
    const trending_response = await fetch("https://itztrending-trends-api.anvil.app/get_trending_data")
    const trending_data = await trending_response.json()
    

    //Reducing the score of old trends

    const trends = await Trend.find()

    trends.forEach(trend => {
        if (Date.now() - trend.last_activity > 24 * 60 * 60 * 1000) {
            trend.trend_score = trend.trend_score * 0.75
            trend.save()
        }
    })

    //Getting new trends

    const created_at = Date.now()

    trending_data.forEach(async trend => {
            const existingTrend = await get_search_results(trend.name, 1)
            
            if (existingTrend.length == 0 || existingTrend[0].score<2) {
                const newTrend = new Trend({
                    name: trend.name,
                    image: trend.image,
                    last_activity: Date.now(),
                    trend_score: 0,
                    created_at: created_at
                })
                console.log("Adding New Trend")
                newTrend.save()
            }

            else {
                //If trend already exists, renew it
                console.log("Renewing Trend")
                existingTrend[0].created_at = created_at
                await Trend.replaceOne({ _id: existingTrend[0]._id }, existingTrend[0]);

            }

    })



}

// get_trends()


// unifyCreatedAtValues(60).catch(console.error);

// updateCreatedAtToLastActivity()