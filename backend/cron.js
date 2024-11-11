const cron = require('node-cron');
const Trend = require('./models/trend')
// Schedule the task to run every day at midnight
cron.schedule('0 0 * * *', get_trends);


async function get_trends() {
    console.log('Running cron job...')
    const trending_response = await fetch("https://itztrending-trends-api.anvil.app/get_trending_data")
    const trending_data = await trending_response.json()
    console.log(trending_data)
    trending_data.forEach(trend => {
        const newTrend = new Trend({
            name: trend.name,
            image: trend.image,
            last_activity: Date.now(),
            trend_score: 0
        })
        newTrend.save()

    })
}

