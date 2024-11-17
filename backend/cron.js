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

async function clean_trends(params) {
    //Removes previous trends that are similar to new trends

    Trend.find().sort({created_at: -1, trend_score: -1}).then(trends => {
        trends.forEach(async trend => {
            const similar_trend = await get_search_results(trend.name)
            console.log(similar_trend)
            if (similar_trend.length > 0 && similar_trend[0].score > 2) {
                similar_trend[0].created_at = Date.now()
                console.log("Removing Similar Trend")
                //delete trend
                await Trend.deleteOne({ _id: trend._id })
            }
        })
    })
}

// get_trends()

// clean_trends()

async function add_trends_in_bulk() {
    var data = [
        {
            
            "name": "Tulsi Vivah 2024 Date",
            "image": "https://assets.thehansindia.com/h-upload/2024/11/09/1495778-tulsi-vivah.jpg",
            "last_activity": "2024-11-13T05:49:55.180Z",
            "trend_score": 50.078125,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.180Z"
        },
        {
            
            "name": "ICC",
            "image": "https://icc-static-files.s3.amazonaws.com/ICC/photo/2018/07/16/cd2fd2a2-f2a3-40e3-b61c-0fe4b51ace6f/ICC-Cricket-World-Cup-CS-_8.jpg",
            "last_activity": "2024-11-14T03:38:28.801Z",
            "trend_score": 26.71875,
            "__v": 0,
            "created_at": "2024-11-14T03:38:28.801Z"
        },
        {
            
            "name": "Gold prices",
            "image": "https://media.geiger-edelmetalle.de/rt:fit/w:800/h:0/g:sm/q:100/plain/local:/media/ce/38/5d/1730994889/7a550d133e91f8c95092cf50e75cd346.png",
            "last_activity": "2024-11-13T05:49:55.178Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.178Z"
        },
        {
            
            "name": "Gladiator 2",
            "image": "https://maxblizz.com/wp-content/uploads/2024/11/Gladiator-2.jpg",
            "last_activity": "2024-11-13T05:49:55.184Z",
            "trend_score": 16.875,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.184Z"
        },
        {
            
            "name": "Saudi Arabia",
            "image": "https://www.traveloffpath.com/wp-content/uploads/2021/06/Kingdom-Tower-Riyadh-Saudi-Arabia.--1536x1491.jpg",
            "last_activity": "2024-11-13T05:49:55.177Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.177Z"
        },
        {
            
            "name": "Man City",
            "image": "https://logodownload.org/wp-content/uploads/2017/02/manchester-city-fc-logo-escudo-badge.png",
            "last_activity": "2024-11-11T03:37:31.463Z",
            "trend_score": 63.4375,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.463Z"
        },
        {
            
            "name": "Ramandeep Singh",
            "image": "https://images.news9live.com/wp-content/uploads/2024/11/Ramandeep-Singh.jpg",
            "last_activity": "2024-11-14T03:38:28.796Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-14T03:38:28.796Z"
        },
        {
            
            "name": "Real Sociedad vs Barcelona",
            "image": "https://transfer-site.co.uk/wp-content/uploads/2024/11/real-sociedad-vs-barcelona-where-to-watch-live-stream-tv-channel-and-start-time-header-image-1536x867.jpg",
            "last_activity": "2024-11-11T03:37:31.464Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.464Z"
        },
        {
            
            "name": "Russia",
            "image": "https://cdn.britannica.com/55/3855-050-EE6EE66C/Russia-map-features-locator.jpg",
            "last_activity": "2024-11-14T03:38:28.804Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-14T03:38:28.804Z"
        },
        {
            
            "name": "Real Madrid",
            "image": "http://www.freelogovectors.net/wp-content/uploads/2018/03/real_madrid_cub_de_futbol-logo.png",
            "last_activity": "2024-11-11T03:37:31.465Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.465Z"
        },
        {
            
            "name": "Dogecoin",
            "image": "https://www.tronweekly.com/wp-content/uploads/2024/11/Dogecoin.webp",
            "last_activity": "2024-11-13T05:49:55.183Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.183Z"
        },
        {
            
            "name": "Mike Waltz",
            "image": "https://d.newsweek.com/en/full/2428651/michael-waltz-2024-rnc.jpg",
            "last_activity": "2024-11-13T05:49:55.180Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.180Z"
        },
        {
            
            "name": "War",
            "image": "https://static.vecteezy.com/system/resources/previews/024/571/656/large_2x/war-concept-military-fighting-scene-on-war-sky-background-soldiers-below-cloudy-skyline-at-night-attack-scene-selective-focus-army-soldiers-in-action-and-firing-on-enemies-with-guns-ai-generated-free-photo.jpg",
            "last_activity": "2024-11-11T03:37:31.470Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.470Z"
        },
        {
            
            "name": "Bitcoin price",
            "image": "https://industrywired.com/wp-content/uploads/2024/11/Bitcoin-Price-Analysisw.jpg",
            "last_activity": "2024-11-13T05:49:55.185Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.185Z"
        },
        {
            
            "name": "India vs South Africa",
            "image": "https://crickex.in/wp-content/uploads/2024/11/sa-vs-ind.jpg",
            "last_activity": "2024-11-11T03:37:31.464Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.464Z"
        },
        {
            
            "name": "Sports",
            "image": "http://kevindailystory.com/wp-content/uploads/2017/02/the-most-popular-sport-in-the-world.jpeg",
            "last_activity": "2024-11-14T03:38:28.784Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-14T03:38:28.784Z"
        },
        {
            
            "name": "Vivek Ramaswamy",
            "image": "https://images.news9live.com/wp-content/uploads/2024/11/Vivek-Ramaswamy-to-take-on-a-major-role-in-Trump-2.0-cabinet.png",
            "last_activity": "2024-11-13T05:49:55.178Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.178Z"
        },
        {
            
            "name": "Cricket",
            "image": "https://cdn.britannica.com/63/211663-050-A674D74C/Jonny-Bairstow-batting-semifinal-match-England-Australia-2019.jpg",
            "last_activity": "2024-11-14T03:38:28.799Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-14T03:38:28.799Z"
        },
        {
            
            "name": "Chelsea vs Arsenal",
            "image": "https://data.ibtimes.sg/en/full/77865/chelsea-vs-arsenal.jpg",
            "last_activity": "2024-11-11T03:37:31.462Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.462Z"
        },
        {
            
            "name": "Vivek Ramaswamy",
            "image": "https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2024/01/1200/675/Vivek-Ramaswamy-caucus-HQ-Clive-IA-Jan.-15-2024.jpg?ve=1&tl=1",
            "last_activity": "2024-11-14T03:38:28.803Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-14T03:38:28.803Z"
        },
        {
            
            "name": "JKBOSE 10th results",
            "image": "https://images.news9live.com/wp-content/uploads/2024/11/JKBOSE-result-2024.jpg",
            "last_activity": "2024-11-13T05:49:55.179Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.179Z"
        },
        {
            
            "name": "Iran",
            "image": "https://cdn.britannica.com/23/1723-050-B5158A32/Iran.jpg",
            "last_activity": "2024-11-13T05:49:55.177Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.177Z"
        },
        {
            
            "name": "Australia vs Pakistan",
            "image": "https://www.hindustantimes.com/ht-img/img/2024/01/04/1600x900/Australia-Pakistan-Cricket-10_1704330496116_1704330533439.jpg",
            "last_activity": "2024-11-11T03:37:31.460Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.460Z"
        },
        {
            
            "name": "Afghanistan vs Bangladesh",
            "image": "https://media.assettype.com/outlookindia/2024-11-09/hcinedxe/GbuUTF0XoAAurM0.jpg?w=801&auto=format,compress&fit=max&format=webp&dpr=1.0",
            "last_activity": "2024-11-13T05:49:55.180Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.180Z"
        },
        {
            
            "name": "New Dzire",
            "image": "https://content.carlelo.com/uploads/cdn_img/new-maruti-dzire-crash-test.webp",
            "last_activity": "2024-11-11T03:37:31.466Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.466Z"
        },
        {
            
            "name": "Dehradun Accident",
            "image": "https://rajyasameeksha.com/Uploads/f5ae6d6e-3b25-4a19-bcdc-e16442564320.jpg",
            "last_activity": "2024-11-13T05:49:55.182Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.182Z"
        },
        {
            
            "name": "IND vs SA 3rd T20",
            "image": "https://www.stackumbrella.com/wp-content/uploads/2024/11/IND-vs-SA-17_11zon-1-768x446.jpg",
            "last_activity": "2024-11-13T05:49:55.181Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.181Z"
        },
        {
            
            "name": "Chief Justice DY Chandrachud",
            "image": "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202411/dy-chandrachud-083414228-16x9_1.jpg?VersionId=cDFmwJugjPw3wRzAp8htdqPR6wf3SQDs",
            "last_activity": "2024-11-11T03:37:31.468Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.468Z"
        },
        {
            
            "name": "GATE 2025",
            "image": "https://ecommpay.com/uploads/2019/10/04/gate2025_openGraphImage.jpg",
            "last_activity": "2024-11-13T05:49:55.183Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.183Z"
        },
        {
            
            "name": "Logan Paul",
            "image": "https://1.bp.blogspot.com/-YJqaGmeU-q8/Xiufq8RiuCI/AAAAAAAAAn0/ZpSpljJlQYAgfhVkSFbRsbRYKlJGZEAyQCLcBGAsYHQ/s1600/Logan-Paul-White.jpg",
            "last_activity": "2024-11-11T03:37:31.464Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.464Z"
        },
        {
            
            "name": "Cricket",
            "image": "https://cdn.britannica.com/63/211663-050-A674D74C/Jonny-Bairstow-batting-semifinal-match-England-Australia-2019.jpg",
            "last_activity": "2024-11-13T05:49:55.185Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.185Z"
        },
        {
            
            "name": "South Africa",
            "image": "https://cdn.britannica.com/30/4230-050-B944C675/South-Africa.jpg",
            "last_activity": "2024-11-11T03:37:31.470Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.470Z"
        },
        {
            
            "name": "The Penguin",
            "image": "https://static1.cbrimages.com/wordpress/wp-content/uploads/sharedimages/2024/09/the-penguin.jpg",
            "last_activity": "2024-11-13T05:49:55.179Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.179Z"
        },
        {
            
            "name": "Man United vs Leicester City",
            "image": "https://data.ibtimes.sg/en/full/77861/manchester-united-vs-leicester-city.jpg?w=736",
            "last_activity": "2024-11-11T03:37:31.462Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.462Z"
        },
        {
            
            "name": "Kanguva review",
            "image": "https://www.masala.com/cloud/2024/08/12/1NKgKxiB-KANGUVA-5-1200x900.jpg",
            "last_activity": "2024-11-14T03:38:28.792Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-14T03:38:28.792Z"
        },
        {
            
            "name": "Russia",
            "image": "https://cdn.britannica.com/55/3855-050-EE6EE66C/Russia-map-features-locator.jpg",
            "last_activity": "2024-11-13T05:49:55.171Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.171Z"
        },
        {
            
            "name": "Sri Lanka vs New Zealand",
            "image": "https://timesng.com/wp-content/uploads/2024/11/sri-lanka-vs-new-zealand-t20i-match-at-1536x922.jpg",
            "last_activity": "2024-11-14T03:38:28.798Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-14T03:38:28.798Z"
        },
        {
            
            "name": "New Zealand vs Sri Lanka",
            "image": "https://media.assettype.com/outlookindia/2024-11-09/rvyyww8e/sri-lanka-vs-new-zealand-t20i?w=801&auto=format,compress&fit=max&format=webp&dpr=1.0",
            "last_activity": "2024-11-11T03:37:31.464Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.464Z"
        },
        {
            
            "name": "Children's Day",
            "image": "https://static.vecteezy.com/system/resources/previews/000/589/206/large_2x/happy-children-s-day-logo-vector.jpg",
            "last_activity": "2024-11-14T03:38:28.799Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-14T03:38:28.799Z"
        },
        {
            
            "name": "Song Jae Rim",
            "image": "https://0.soompi.io/wp-content/uploads/2024/11/12021618/song-jae-rim.jpg",
            "last_activity": "2024-11-13T05:49:55.178Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.178Z"
        },
        {
            
            "name": "Swiggy share price",
            "image": "https://www.livemint.com/lm-img/img/2024/11/13/1600x900/Swiggy_share_price_NSE_Stock_market_today_1731482777193_1731482777524.jfif",
            "last_activity": "2024-11-14T03:38:28.800Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-14T03:38:28.800Z"
        },
        {
            
            "name": "Delhi Ganesh",
            "image": "https://m.media-amazon.com/images/M/MV5BNjdjNmQ0ZWUtNWUzOS00NzYzLTkwMWUtOGZkYTgxYzlkOWU3XkEyXkFqcGdeQXVyMjYwMDk5NjE@.V1_FMjpg_UX1000.jpg",
            "last_activity": "2024-11-11T03:37:31.461Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.461Z"
        },
        {
            
            "name": "Justin Welby Archbishop of Canterbury",
            "image": "https://thewhistler.ng/wp-content/uploads/2024/10/Archbishop-of-Canterbury-Justin-Welby_20241023_151224_0000-scaled.jpg",
            "last_activity": "2024-11-14T03:38:28.802Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-14T03:38:28.802Z"
        },
        {
            
            "name": "Manoj Mitra",
            "image": "https://static.dynamitenews.com/images/2024/11/12/manoj-mitra-death-legendary-bengali-playwright-passes-away-at-86/6732f3f8b1c00.jpg",
            "last_activity": "2024-11-13T05:49:55.178Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.178Z"
        },
        {
            
            "name": "Russian",
            "image": "https://cdn.thecollector.com/wp-content/uploads/2022/07/russian-leaders-who-shaped-russian-history.jpg",
            "last_activity": "2024-11-11T03:37:31.466Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.466Z"
        },
        {
            
            "name": "David Miller",
            "image": "https://www.ecured.cu/images/7/7c/Il_Divo_david_miller.jpg",
            "last_activity": "2024-11-11T03:37:31.455Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.455Z"
        },
        {
            
            "name": "Varun Chakaravarthy",
            "image": "https://img.cricketnmore.com/uploads/2024/11/varun-chakaravarthy-and-ravi-bishnoi-had-a-great-partnership-with-the-ball-says-mark-boucher.JPG",
            "last_activity": "2024-11-11T03:37:31.461Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.461Z"
        },
        {
            
            "name": "Pak vs AUS",
            "image": "https://images.indianexpress.com/2019/11/Pak-vs-Aus-2nd-T20I_759.jpg?resize=600",
            "last_activity": "2024-11-11T03:37:31.461Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.461Z"
        },
        {
            
            "name": "SL vs NZ",
            "image": "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2019/06/01/Pictures/lanka-cricket-world-cup-new-zealand-sri_2f8eb2f6-846f-11e9-9324-f283958e02d5.jpg",
            "last_activity": "2024-11-11T03:37:31.468Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-11T03:37:31.468Z"
        },
        {
            
            "name": "Mission: Impossible",
            "image": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEicn1CeUc5CXwYFLc8JNCc6GD_AyRRlhPnyK3KlhwAG-ag0IhCKQPHrtKG8oPAG9E0Vf6PATuW5NpDfXSYvWdRwcY9HvZSe0_aE4k-n4NV-mab6bQV2iI2Vv3McN6hL1YePRjIFoB3oa5wxHB365szcNdPtAMO6rVMe_ghXlP0NzpF1LlMhsXJkw1mdbw/s1600/Mission-Impossible-7-033-Tom_Cruise-Christopher_McQuarrie.jpg",
            "last_activity": "2024-11-13T05:49:55.182Z",
            "trend_score": 0,
            "__v": 0,
            "created_at": "2024-11-13T05:49:55.182Z"
        },
      {
        
        "name": "IND vs SA T20",
        "image": "https://images.indianexpress.com/2024/11/IND-SA-30.jpg",
        "last_activity": "2024-11-14T18:30:19.147Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "England vs West Indies",
        "image": "https://media.assettype.com/outlookindia/2024-11-15/5sw5t6nq/west-indies-vs-england-4th-t20i-ap-photo.jpg?w=1200&amp;ar=40:21&amp;auto=format,compress&amp;ogImage=true&amp;mode=crop&amp;enlarge=true&amp;overlay=false&amp;overlay_position=bottom&amp;overlay_width=100",
        "last_activity": "2024-11-17T06:54:14.449Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "England vs West Indies",
        "image": "https://static.cricketaddictor.com/images/2024/EnglandvsWestIndies.jpg?q=80",
        "last_activity": "2024-11-17T06:45:44.154Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "England vs West Indies",
        "image": "https://images.indianexpress.com/2016/04/west-indies-pti1.jpg",
        "last_activity": "2024-11-17T06:26:37.517Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "IND vs SA 3rd T20",
        "image": "https://www.stackumbrella.com/wp-content/uploads/2024/11/IND-vs-SA-17_11zon-1-768x446.jpg",
        "last_activity": "2024-11-13T05:49:55.181Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Man United vs Leicester City",
        "image": "https://data.ibtimes.sg/en/full/77861/manchester-united-vs-leicester-city.jpg?w=736",
        "last_activity": "2024-11-11T03:37:31.462Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Mike Tyson vs Jake Paul",
        "image": "https://www.bjpenn.com/wp-content/uploads/2024/03/Mike-Tyson-Jake-Paul.jpg",
        "last_activity": "2024-11-17T06:26:37.755Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Mike Tyson vs Jake Paul",
        "image": "https://www.bjpenn.com/wp-content/uploads/2024/03/Mike-Tyson-Jake-Paul.jpg",
        "last_activity": "2024-11-17T06:45:44.414Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "IND vs SA 4th T20",
        "image": "https://images.indianexpress.com/2024/11/IND-SA-32.jpg",
        "last_activity": "2024-11-17T06:45:44.316Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "IND vs SA 4th T20",
        "image": "https://images.indianexpress.com/2024/11/IND-SA-32.jpg",
        "last_activity": "2024-11-17T06:54:14.640Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Mike Tyson vs Jake Paul",
        "image": "https://www.bjpenn.com/wp-content/uploads/2024/03/Mike-Tyson-Jake-Paul.jpg",
        "last_activity": "2024-11-17T06:54:14.705Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "IND vs SA 4th T20",
        "image": "https://images.indianexpress.com/2024/11/IND-SA-32.jpg",
        "last_activity": "2024-11-17T06:26:37.674Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Man City",
        "image": "https://logodownload.org/wp-content/uploads/2017/02/manchester-city-fc-logo-escudo-badge.png",
        "last_activity": "2024-11-11T03:37:31.463Z",
        "trend_score": 62.578125,
        "score": 3.560828685760498
      },
      {
        
        "name": "Man United vs Leicester City",
        "image": "https://data.ibtimes.sg/en/full/77861/manchester-united-vs-leicester-city.jpg?w=736",
        "last_activity": "2024-11-11T03:37:31.462Z",
        "trend_score": 0,
        "score": 2.3108654022216797
      },
      {
        
        "name": "Man United vs Leicester City",
        "image": "https://data.ibtimes.sg/en/full/77861/manchester-united-vs-leicester-city.jpg?w=736",
        "last_activity": "2024-11-11T03:37:31.462Z",
        "trend_score": 0,
        "score": 5.847405433654785
      },
      {
        
        "name": "Man City",
        "image": "https://logodownload.org/wp-content/uploads/2017/02/manchester-city-fc-logo-escudo-badge.png",
        "last_activity": "2024-11-11T03:37:31.463Z",
        "trend_score": 62.578125,
        "score": 3.560828685760498
      },
      {
        
        "name": "Afghanistan vs Bangladesh",
        "image": "https://media.assettype.com/outlookindia/2024-11-09/hcinedxe/GbuUTF0XoAAurM0.jpg?w=801&auto=format,compress&fit=max&format=webp&dpr=1.0",
        "last_activity": "2024-11-13T05:49:55.180Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "SL vs NZ",
        "image": "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2019/06/01/Pictures/lanka-cricket-world-cup-new-zealand-sri_2f8eb2f6-846f-11e9-9324-f283958e02d5.jpg",
        "last_activity": "2024-11-11T03:37:31.468Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "IND vs SA",
        "image": "https://www.zoomnews.in/uploads_2019/newses/ind-vs-sa_1527800869_sm.webp",
        "last_activity": "2024-11-14T03:38:28.795Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Pak vs AUS",
        "image": "https://images.indianexpress.com/2019/11/Pak-vs-Aus-2nd-T20I_759.jpg?resize=600",
        "last_activity": "2024-11-11T03:37:31.461Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Chelsea vs Arsenal",
        "image": "https://data.ibtimes.sg/en/full/77865/chelsea-vs-arsenal.jpg",
        "last_activity": "2024-11-11T03:37:31.462Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Australia vs Pakistan",
        "image": "https://images.indianexpress.com/2024/11/Babar-Azam-Abdullah-Shafique-Australia-vs-Pakistan.jpg",
        "last_activity": "2024-11-14T18:30:19.144Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Australia vs Pakistan",
        "image": "https://assets.khelnow.com/news/uploads/2024/11/185-Australia-v-Pakistan-copy.jpg",
        "last_activity": "2024-11-17T06:45:44.357Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Australia vs Pakistan",
        "image": "https://assets.khelnow.com/news/uploads/2024/11/185-Australia-v-Pakistan-copy.jpg",
        "last_activity": "2024-11-17T06:26:38.012Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Australia vs Pakistan",
        "image": "https://assets.khelnow.com/news/uploads/2024/11/185-Australia-v-Pakistan-copy.jpg",
        "last_activity": "2024-11-17T06:54:14.784Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Australia vs Pakistan",
        "image": "https://www.hindustantimes.com/ht-img/img/2024/01/04/1600x900/Australia-Pakistan-Cricket-10_1704330496116_1704330533439.jpg",
        "last_activity": "2024-11-11T03:37:31.460Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "India vs South Africa",
        "image": "https://media.assettype.com/outlookindia/2024-11-09/nqlynj9m/South_Africa_vs_India_1st_T20_Cricket_at_Kingsmead_stadium_in_Durban_photos9.jpg?w=801&auto=format,compress&fit=max&format=webp&dpr=1.0",
        "last_activity": "2024-11-14T03:38:28.792Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "India vs South Africa",
        "image": "https://media.assettype.com/outlookindia/2024-11-09/nqlynj9m/South_Africa_vs_India_1st_T20_Cricket_at_Kingsmead_stadium_in_Durban_photos9.jpg?w=801&auto=format,compress&fit=max&format=webp&dpr=1.0",
        "last_activity": "2024-11-14T18:30:19.144Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "India vs South Africa",
        "image": "https://crickex.in/wp-content/uploads/2024/11/sa-vs-ind.jpg",
        "last_activity": "2024-11-11T03:37:31.464Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "Real Sociedad vs Barcelona",
        "image": "https://transfer-site.co.uk/wp-content/uploads/2024/11/real-sociedad-vs-barcelona-where-to-watch-live-stream-tv-channel-and-start-time-header-image-1536x867.jpg",
        "last_activity": "2024-11-11T03:37:31.464Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "IND vs SA T20",
        "image": "https://images.indianexpress.com/2024/11/IND-SA-30.jpg",
        "last_activity": "2024-11-14T18:30:19.147Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "England vs West Indies",
        "image": "https://media.assettype.com/outlookindia/2024-11-15/5sw5t6nq/west-indies-vs-england-4th-t20i-ap-photo.jpg?w=1200&amp;ar=40:21&amp;auto=format,compress&amp;ogImage=true&amp;mode=crop&amp;enlarge=true&amp;overlay=false&amp;overlay_position=bottom&amp;overlay_width=100",
        "last_activity": "2024-11-17T06:54:14.449Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "England vs West Indies",
        "image": "https://static.cricketaddictor.com/images/2024/EnglandvsWestIndies.jpg?q=80",
        "last_activity": "2024-11-17T06:45:44.154Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "England vs West Indies",
        "image": "https://images.indianexpress.com/2016/04/west-indies-pti1.jpg",
        "last_activity": "2024-11-17T06:26:37.517Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "IND vs SA 3rd T20",
        "image": "https://www.stackumbrella.com/wp-content/uploads/2024/11/IND-vs-SA-17_11zon-1-768x446.jpg",
        "last_activity": "2024-11-13T05:49:55.181Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Sri Lanka vs New Zealand",
        "image": "https://timesng.com/wp-content/uploads/2024/11/sri-lanka-vs-new-zealand-t20i-match-at-1536x922.jpg",
        "last_activity": "2024-11-14T03:38:28.798Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Sri Lanka vs New Zealand",
        "image": "https://timesng.com/wp-content/uploads/2024/11/sri-lanka-vs-new-zealand-t20i-match-at-1536x922.jpg",
        "last_activity": "2024-11-14T18:30:19.144Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "New Zealand vs Sri Lanka",
        "image": "https://media.assettype.com/outlookindia/2024-11-09/rvyyww8e/sri-lanka-vs-new-zealand-t20i?w=801&auto=format,compress&fit=max&format=webp&dpr=1.0",
        "last_activity": "2024-11-11T03:37:31.464Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Mike Tyson vs Jake Paul",
        "image": "https://www.bjpenn.com/wp-content/uploads/2024/03/Mike-Tyson-Jake-Paul.jpg",
        "last_activity": "2024-11-17T06:26:37.755Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Mike Tyson vs Jake Paul",
        "image": "https://www.bjpenn.com/wp-content/uploads/2024/03/Mike-Tyson-Jake-Paul.jpg",
        "last_activity": "2024-11-17T06:45:44.414Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "IND vs SA 4th T20",
        "image": "https://images.indianexpress.com/2024/11/IND-SA-32.jpg",
        "last_activity": "2024-11-17T06:45:44.316Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "IND vs SA 4th T20",
        "image": "https://images.indianexpress.com/2024/11/IND-SA-32.jpg",
        "last_activity": "2024-11-17T06:54:14.640Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Mike Tyson vs Jake Paul",
        "image": "https://www.bjpenn.com/wp-content/uploads/2024/03/Mike-Tyson-Jake-Paul.jpg",
        "last_activity": "2024-11-17T06:54:14.705Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "IND vs SA 4th T20",
        "image": "https://images.indianexpress.com/2024/11/IND-SA-32.jpg",
        "last_activity": "2024-11-17T06:26:37.674Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Delhi Ganesh",
        "image": "https://m.media-amazon.com/images/M/MV5BNjdjNmQ0ZWUtNWUzOS00NzYzLTkwMWUtOGZkYTgxYzlkOWU3XkEyXkFqcGdeQXVyMjYwMDk5NjE@._V1_FMjpg_UX1000_.jpg",
        "last_activity": "2024-11-11T03:37:31.461Z",
        "trend_score": 0,
        "score": 4.390271186828613
      },
      {
        
        "name": "AQI Delhi",
        "image": "https://imgeng.jagran.com/images/2024/11/12/article/image/Delhi-AQI-1731385997185.jpg",
        "last_activity": "2024-11-14T03:38:28.808Z",
        "trend_score": 0,
        "score": 2.0695128440856934
      },
      {
        
        "name": "Chelsea vs Arsenal",
        "image": "https://data.ibtimes.sg/en/full/77865/chelsea-vs-arsenal.jpg",
        "last_activity": "2024-11-11T03:37:31.462Z",
        "trend_score": 0,
        "score": 4.6170196533203125
      },
      {
        
        "name": "Afghanistan vs Bangladesh",
        "image": "https://media.assettype.com/outlookindia/2024-11-09/hcinedxe/GbuUTF0XoAAurM0.jpg?w=801&auto=format,compress&fit=max&format=webp&dpr=1.0",
        "last_activity": "2024-11-13T05:49:55.180Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "SL vs NZ",
        "image": "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2019/06/01/Pictures/lanka-cricket-world-cup-new-zealand-sri_2f8eb2f6-846f-11e9-9324-f283958e02d5.jpg",
        "last_activity": "2024-11-11T03:37:31.468Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "IND vs SA",
        "image": "https://www.zoomnews.in/uploads_2019/newses/ind-vs-sa_1527800869_sm.webp",
        "last_activity": "2024-11-14T03:38:28.795Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Pak vs AUS",
        "image": "https://images.indianexpress.com/2019/11/Pak-vs-Aus-2nd-T20I_759.jpg?resize=600",
        "last_activity": "2024-11-11T03:37:31.461Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Australia vs Pakistan",
        "image": "https://images.indianexpress.com/2024/11/Babar-Azam-Abdullah-Shafique-Australia-vs-Pakistan.jpg",
        "last_activity": "2024-11-14T18:30:19.144Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Australia vs Pakistan",
        "image": "https://assets.khelnow.com/news/uploads/2024/11/185-Australia-v-Pakistan-copy.jpg",
        "last_activity": "2024-11-17T06:45:44.357Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Australia vs Pakistan",
        "image": "https://assets.khelnow.com/news/uploads/2024/11/185-Australia-v-Pakistan-copy.jpg",
        "last_activity": "2024-11-17T06:26:38.012Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Australia vs Pakistan",
        "image": "https://assets.khelnow.com/news/uploads/2024/11/185-Australia-v-Pakistan-copy.jpg",
        "last_activity": "2024-11-17T06:54:14.784Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Australia vs Pakistan",
        "image": "https://www.hindustantimes.com/ht-img/img/2024/01/04/1600x900/Australia-Pakistan-Cricket-10_1704330496116_1704330533439.jpg",
        "last_activity": "2024-11-11T03:37:31.460Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "India vs South Africa",
        "image": "https://media.assettype.com/outlookindia/2024-11-09/nqlynj9m/South_Africa_vs_India_1st_T20_Cricket_at_Kingsmead_stadium_in_Durban_photos9.jpg?w=801&auto=format,compress&fit=max&format=webp&dpr=1.0",
        "last_activity": "2024-11-14T03:38:28.792Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "India vs South Africa",
        "image": "https://media.assettype.com/outlookindia/2024-11-09/nqlynj9m/South_Africa_vs_India_1st_T20_Cricket_at_Kingsmead_stadium_in_Durban_photos9.jpg?w=801&auto=format,compress&fit=max&format=webp&dpr=1.0",
        "last_activity": "2024-11-14T18:30:19.144Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "India vs South Africa",
        "image": "https://crickex.in/wp-content/uploads/2024/11/sa-vs-ind.jpg",
        "last_activity": "2024-11-11T03:37:31.464Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "Real Sociedad vs Barcelona",
        "image": "https://transfer-site.co.uk/wp-content/uploads/2024/11/real-sociedad-vs-barcelona-where-to-watch-live-stream-tv-channel-and-start-time-header-image-1536x867.jpg",
        "last_activity": "2024-11-11T03:37:31.464Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "IND vs SA T20",
        "image": "https://images.indianexpress.com/2024/11/IND-SA-30.jpg",
        "last_activity": "2024-11-14T18:30:19.147Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "England vs West Indies",
        "image": "https://media.assettype.com/outlookindia/2024-11-15/5sw5t6nq/west-indies-vs-england-4th-t20i-ap-photo.jpg?w=1200&amp;ar=40:21&amp;auto=format,compress&amp;ogImage=true&amp;mode=crop&amp;enlarge=true&amp;overlay=false&amp;overlay_position=bottom&amp;overlay_width=100",
        "last_activity": "2024-11-17T06:54:14.449Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "England vs West Indies",
        "image": "https://static.cricketaddictor.com/images/2024/EnglandvsWestIndies.jpg?q=80",
        "last_activity": "2024-11-17T06:45:44.154Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "England vs West Indies",
        "image": "https://images.indianexpress.com/2016/04/west-indies-pti1.jpg",
        "last_activity": "2024-11-17T06:26:37.517Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "IND vs SA 3rd T20",
        "image": "https://www.stackumbrella.com/wp-content/uploads/2024/11/IND-vs-SA-17_11zon-1-768x446.jpg",
        "last_activity": "2024-11-13T05:49:55.181Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Sri Lanka vs New Zealand",
        "image": "https://timesng.com/wp-content/uploads/2024/11/sri-lanka-vs-new-zealand-t20i-match-at-1536x922.jpg",
        "last_activity": "2024-11-14T03:38:28.798Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Sri Lanka vs New Zealand",
        "image": "https://timesng.com/wp-content/uploads/2024/11/sri-lanka-vs-new-zealand-t20i-match-at-1536x922.jpg",
        "last_activity": "2024-11-14T18:30:19.144Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Man United vs Leicester City",
        "image": "https://data.ibtimes.sg/en/full/77861/manchester-united-vs-leicester-city.jpg?w=736",
        "last_activity": "2024-11-11T03:37:31.462Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "New Zealand vs Sri Lanka",
        "image": "https://media.assettype.com/outlookindia/2024-11-09/rvyyww8e/sri-lanka-vs-new-zealand-t20i?w=801&auto=format,compress&fit=max&format=webp&dpr=1.0",
        "last_activity": "2024-11-11T03:37:31.464Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Mike Tyson vs Jake Paul",
        "image": "https://www.bjpenn.com/wp-content/uploads/2024/03/Mike-Tyson-Jake-Paul.jpg",
        "last_activity": "2024-11-17T06:26:37.755Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Mike Tyson vs Jake Paul",
        "image": "https://www.bjpenn.com/wp-content/uploads/2024/03/Mike-Tyson-Jake-Paul.jpg",
        "last_activity": "2024-11-17T06:45:44.414Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "IND vs SA 4th T20",
        "image": "https://images.indianexpress.com/2024/11/IND-SA-32.jpg",
        "last_activity": "2024-11-17T06:45:44.316Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "IND vs SA 4th T20",
        "image": "https://images.indianexpress.com/2024/11/IND-SA-32.jpg",
        "last_activity": "2024-11-17T06:54:14.640Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Mike Tyson vs Jake Paul",
        "image": "https://www.bjpenn.com/wp-content/uploads/2024/03/Mike-Tyson-Jake-Paul.jpg",
        "last_activity": "2024-11-17T06:54:14.705Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "IND vs SA 4th T20",
        "image": "https://images.indianexpress.com/2024/11/IND-SA-32.jpg",
        "last_activity": "2024-11-17T06:26:37.674Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Real Sociedad vs Barcelona",
        "image": "https://transfer-site.co.uk/wp-content/uploads/2024/11/real-sociedad-vs-barcelona-where-to-watch-live-stream-tv-channel-and-start-time-header-image-1536x867.jpg",
        "last_activity": "2024-11-11T03:37:31.464Z",
        "trend_score": 0,
        "score": 5.5262131690979
      },
      {
        
        "name": "Real Madrid",
        "image": "http://www.freelogovectors.net/wp-content/uploads/2018/03/real_madrid_cub_de_futbol-logo.png",
        "last_activity": "2024-11-11T03:37:31.465Z",
        "trend_score": 0,
        "score": 2.0695128440856934
      },
      {
        
        "name": "Afghanistan vs Bangladesh",
        "image": "https://media.assettype.com/outlookindia/2024-11-09/hcinedxe/GbuUTF0XoAAurM0.jpg?w=801&auto=format,compress&fit=max&format=webp&dpr=1.0",
        "last_activity": "2024-11-13T05:49:55.180Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "SL vs NZ",
        "image": "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2019/06/01/Pictures/lanka-cricket-world-cup-new-zealand-sri_2f8eb2f6-846f-11e9-9324-f283958e02d5.jpg",
        "last_activity": "2024-11-11T03:37:31.468Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "IND vs SA",
        "image": "https://www.zoomnews.in/uploads_2019/newses/ind-vs-sa_1527800869_sm.webp",
        "last_activity": "2024-11-14T03:38:28.795Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Pak vs AUS",
        "image": "https://images.indianexpress.com/2019/11/Pak-vs-Aus-2nd-T20I_759.jpg?resize=600",
        "last_activity": "2024-11-11T03:37:31.461Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Chelsea vs Arsenal",
        "image": "https://data.ibtimes.sg/en/full/77865/chelsea-vs-arsenal.jpg",
        "last_activity": "2024-11-11T03:37:31.462Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Australia vs Pakistan",
        "image": "https://images.indianexpress.com/2024/11/Babar-Azam-Abdullah-Shafique-Australia-vs-Pakistan.jpg",
        "last_activity": "2024-11-14T18:30:19.144Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Australia vs Pakistan",
        "image": "https://assets.khelnow.com/news/uploads/2024/11/185-Australia-v-Pakistan-copy.jpg",
        "last_activity": "2024-11-17T06:45:44.357Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Australia vs Pakistan",
        "image": "https://assets.khelnow.com/news/uploads/2024/11/185-Australia-v-Pakistan-copy.jpg",
        "last_activity": "2024-11-17T06:26:38.012Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Australia vs Pakistan",
        "image": "https://assets.khelnow.com/news/uploads/2024/11/185-Australia-v-Pakistan-copy.jpg",
        "last_activity": "2024-11-17T06:54:14.784Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "Australia vs Pakistan",
        "image": "https://www.hindustantimes.com/ht-img/img/2024/01/04/1600x900/Australia-Pakistan-Cricket-10_1704330496116_1704330533439.jpg",
        "last_activity": "2024-11-11T03:37:31.460Z",
        "trend_score": 0,
        "score": 0.6845378875732422
      },
      {
        
        "name": "India vs South Africa",
        "image": "https://media.assettype.com/outlookindia/2024-11-09/nqlynj9m/South_Africa_vs_India_1st_T20_Cricket_at_Kingsmead_stadium_in_Durban_photos9.jpg?w=801&auto=format,compress&fit=max&format=webp&dpr=1.0",
        "last_activity": "2024-11-14T03:38:28.792Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "India vs South Africa",
        "image": "https://media.assettype.com/outlookindia/2024-11-09/nqlynj9m/South_Africa_vs_India_1st_T20_Cricket_at_Kingsmead_stadium_in_Durban_photos9.jpg?w=801&auto=format,compress&fit=max&format=webp&dpr=1.0",
        "last_activity": "2024-11-14T18:30:19.144Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "India vs South Africa",
        "image": "https://crickex.in/wp-content/uploads/2024/11/sa-vs-ind.jpg",
        "last_activity": "2024-11-11T03:37:31.464Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "IND vs SA T20",
        "image": "https://images.indianexpress.com/2024/11/IND-SA-30.jpg",
        "last_activity": "2024-11-14T18:30:19.147Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "England vs West Indies",
        "image": "https://media.assettype.com/outlookindia/2024-11-15/5sw5t6nq/west-indies-vs-england-4th-t20i-ap-photo.jpg?w=1200&amp;ar=40:21&amp;auto=format,compress&amp;ogImage=true&amp;mode=crop&amp;enlarge=true&amp;overlay=false&amp;overlay_position=bottom&amp;overlay_width=100",
        "last_activity": "2024-11-17T06:54:14.449Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "England vs West Indies",
        "image": "https://static.cricketaddictor.com/images/2024/EnglandvsWestIndies.jpg?q=80",
        "last_activity": "2024-11-17T06:45:44.154Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "England vs West Indies",
        "image": "https://images.indianexpress.com/2016/04/west-indies-pti1.jpg",
        "last_activity": "2024-11-17T06:26:37.517Z",
        "trend_score": 0,
        "score": 0.5938253402709961
      },
      {
        
        "name": "IND vs SA 3rd T20",
        "image": "https://www.stackumbrella.com/wp-content/uploads/2024/11/IND-vs-SA-17_11zon-1-768x446.jpg",
        "last_activity": "2024-11-13T05:49:55.181Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Sri Lanka vs New Zealand",
        "image": "https://timesng.com/wp-content/uploads/2024/11/sri-lanka-vs-new-zealand-t20i-match-at-1536x922.jpg",
        "last_activity": "2024-11-14T03:38:28.798Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Sri Lanka vs New Zealand",
        "image": "https://timesng.com/wp-content/uploads/2024/11/sri-lanka-vs-new-zealand-t20i-match-at-1536x922.jpg",
        "last_activity": "2024-11-14T18:30:19.144Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Man United vs Leicester City",
        "image": "https://data.ibtimes.sg/en/full/77861/manchester-united-vs-leicester-city.jpg?w=736",
        "last_activity": "2024-11-11T03:37:31.462Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "New Zealand vs Sri Lanka",
        "image": "https://media.assettype.com/outlookindia/2024-11-09/rvyyww8e/sri-lanka-vs-new-zealand-t20i?w=801&auto=format,compress&fit=max&format=webp&dpr=1.0",
        "last_activity": "2024-11-11T03:37:31.464Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Mike Tyson vs Jake Paul",
        "image": "https://www.bjpenn.com/wp-content/uploads/2024/03/Mike-Tyson-Jake-Paul.jpg",
        "last_activity": "2024-11-17T06:26:37.755Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Mike Tyson vs Jake Paul",
        "image": "https://www.bjpenn.com/wp-content/uploads/2024/03/Mike-Tyson-Jake-Paul.jpg",
        "last_activity": "2024-11-17T06:45:44.414Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "IND vs SA 4th T20",
        "image": "https://images.indianexpress.com/2024/11/IND-SA-32.jpg",
        "last_activity": "2024-11-17T06:45:44.316Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "IND vs SA 4th T20",
        "image": "https://images.indianexpress.com/2024/11/IND-SA-32.jpg",
        "last_activity": "2024-11-17T06:54:14.640Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Mike Tyson vs Jake Paul",
        "image": "https://www.bjpenn.com/wp-content/uploads/2024/03/Mike-Tyson-Jake-Paul.jpg",
        "last_activity": "2024-11-17T06:54:14.705Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "IND vs SA 4th T20",
        "image": "https://images.indianexpress.com/2024/11/IND-SA-32.jpg",
        "last_activity": "2024-11-17T06:26:37.674Z",
        "trend_score": 0,
        "score": 0.5243415832519531
      },
      {
        
        "name": "Varun Chakaravarthy",
        "image": "https://img.cricketnmore.com/uploads/2024/11/varun-chakaravarthy-and-ravi-bishnoi-had-a-great-partnership-with-the-ball-says-mark-boucher.JPG",
        "last_activity": "2024-11-11T03:37:31.461Z",
        "trend_score": 0,
        "score": 4.641517162322998
      },
      {
        
        "name": "Bitcoin price",
        "image": "https://industrywired.com/wp-content/uploads/2024/11/Bitcoin-Price-Analysisw.jpg",
        "last_activity": "2024-11-13T05:49:55.185Z",
        "trend_score": 0,
        "score": 4.390271186828613
      },
      {
        
        "name": "Swiggy share price",
        "image": "https://www.livemint.com/lm-img/img/2024/11/13/1600x900/Swiggy_share_price_NSE_Stock_market_today_1731482777193_1731482777524.jfif",
        "last_activity": "2024-11-14T03:38:28.800Z",
        "trend_score": 0,
        "score": 1.7533752918243408
      },
      {
        
        "name": "David Miller",
        "image": "https://www.ecured.cu/images/7/7c/Il_Divo_david_miller.jpg",
        "last_activity": "2024-11-11T03:37:31.455Z",
        "trend_score": 0,
        "score": 4.641517162322998
      },
      {
        
        "name": "Iran",
        "image": "https://i.natgeofe.com/k/5ad67c82-3cbe-4cb7-b11a-ef7cc104a599/iran-tehran_4x3.jpg",
        "last_activity": "2024-11-14T03:38:28.808Z",
        "trend_score": 0,
        "score": 2.290462017059326
      },
      {
        
        "name": "Iran",
        "image": "https://cdn.britannica.com/23/1723-050-B5158A32/Iran.jpg",
        "last_activity": "2024-11-13T05:49:55.177Z",
        "trend_score": 0,
        "score": 2.290462017059326
      },
      {
        
        "name": "Pak vs AUS",
        "image": "https://images.indianexpress.com/2019/11/Pak-vs-Aus-2nd-T20I_759.jpg?resize=600",
        "last_activity": "2024-11-11T03:37:31.461Z",
        "trend_score": 0,
        "score": 4.253282070159912
      },
      {
        
        "name": "Afghanistan vs Bangladesh",
        "image": "https://media.assettype.com/outlookindia/2024-11-09/hcinedxe/GbuUTF0XoAAurM0.jpg?w=801&auto=format,compress&fit=max&format=webp&dpr=1.0",
        "last_activity": "2024-11-13T05:49:55.180Z",
        "trend_score": 0,
        "score": 0.6391757726669312
      },
      {
        
        "name": "SL vs NZ",
        "image": "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2019/06/01/Pictures/lanka-cricket-world-cup-new-zealand-sri_2f8eb2f6-846f-11e9-9324-f283958e02d5.jpg",
        "last_activity": "2024-11-11T03:37:31.468Z",
        "trend_score": 0,
        "score": 0.6391757726669312
      },
      {
        
        "name": "IND vs SA",
        "image": "https://www.zoomnews.in/uploads_2019/newses/ind-vs-sa_1527800869_sm.webp",
        "last_activity": "2024-11-14T03:38:28.795Z",
        "trend_score": 0,
        "score": 0.6391757726669312
      },
      {
        
        "name": "Chelsea vs Arsenal",
        "image": "https://data.ibtimes.sg/en/full/77865/chelsea-vs-arsenal.jpg",
        "last_activity": "2024-11-11T03:37:31.462Z",
        "trend_score": 0,
        "score": 0.6391757726669312
      },
      {
        
        "name": "India vs South Africa",
        "image": "https://media.assettype.com/outlookindia/2024-11-09/nqlynj9m/South_Africa_vs_India_1st_T20_Cricket_at_Kingsmead_stadium_in_Durban_photos9.jpg?w=801&auto=format,compress&fit=max&format=webp&dpr=1.0",
        "last_activity": "2024-11-14T03:38:28.792Z",
        "trend_score": 0,
        "score": 0.5547674298286438
      },
      {
        
        "name": "India vs South Africa",
        "image": "https://crickex.in/wp-content/uploads/2024/11/sa-vs-ind.jpg",
        "last_activity": "2024-11-11T03:37:31.464Z",
        "trend_score": 0,
        "score": 0.5547674298286438
      },
      {
        
        "name": "Real Sociedad vs Barcelona",
        "image": "https://transfer-site.co.uk/wp-content/uploads/2024/11/real-sociedad-vs-barcelona-where-to-watch-live-stream-tv-channel-and-start-time-header-image-1536x867.jpg",
        "last_activity": "2024-11-11T03:37:31.464Z",
        "trend_score": 0,
        "score": 0.5547674298286438
      },
      {
        
        "name": "IND vs SA 3rd T20",
        "image": "https://www.stackumbrella.com/wp-content/uploads/2024/11/IND-vs-SA-17_11zon-1-768x446.jpg",
        "last_activity": "2024-11-13T05:49:55.181Z",
        "trend_score": 0,
        "score": 0.4900519847869873
      },
      {
        
        "name": "Man United vs Leicester City",
        "image": "https://data.ibtimes.sg/en/full/77861/manchester-united-vs-leicester-city.jpg?w=736",
        "last_activity": "2024-11-11T03:37:31.462Z",
        "trend_score": 0,
        "score": 0.4900519847869873
      },
      {
        
        "name": "New Zealand vs Sri Lanka",
        "image": "https://media.assettype.com/outlookindia/2024-11-09/rvyyww8e/sri-lanka-vs-new-zealand-t20i?w=801&auto=format,compress&fit=max&format=webp&dpr=1.0",
        "last_activity": "2024-11-11T03:37:31.464Z",
        "trend_score": 0,
        "score": 0.4900519847869873
      }
    ]
    
    Trend.deleteMany({}).then(() => {
        Trend.insertMany(data).then(() => {
            console.log("Trends inserted")
        })
    })
    
}

// add_trends_in_bulk()

async function delete_duplicate_trends() {
    const allTrends = await Trend.find({}, { _id: 1, name: 1 }); // Fetch all trends with only `_id` and `name`
    
    for (const trend of allTrends) {
        const similarTrends = await get_search_results(trend.name, 1); // Get the closest similar trend
        
        if (similarTrends.length > 0) {
            const similarTrend = similarTrends[0];
            
            // Check if the similar trend has a higher score and is not the same trend
            if (similarTrend.score > 2 && similarTrend._id.toString() !== trend._id.toString()) {
                console.log(`Deleting trend: ${trend.name} with _id: ${trend._id}`);
                await Trend.deleteOne({ _id: trend._id }); // Delete the current trend
            }
        }
    }
    
    console.log("Duplicate trend cleanup completed.");
}

// delete_duplicate_trends()

async function updateCreatedAtToLastActivity() {
    const result = await Trend.updateMany(
        {}, // Match all documents
        [
            {
                $set: {
                    created_at: "$last_activity" // Use aggregation pipeline to set the value
                }
            }
        ]
    );

    console.log(`${result.modifiedCount} documents updated.`);
}

async function unifyCreatedAtValues(thresholdInSeconds = 60) {
    // Fetch all records sorted by `created_at` to process them sequentially
    const trends = await Trend.find({}, { _id: 1, created_at: 1 }).sort({ created_at: 1 });

    if (trends.length === 0) {
        console.log("No records found.");
        return;
    }

    let unifiedValue = trends[0].created_at; // Start with the first record's created_at value
    const threshold = thresholdInSeconds * 1000; // Convert threshold to milliseconds

    for (let i = 0; i < trends.length; i++) {
        const currentTrend = trends[i];

        // Calculate time difference from the current `unifiedValue`
        const timeDifference = Math.abs(currentTrend.created_at - unifiedValue);

        if (timeDifference > threshold) {
            // If difference exceeds the threshold, update the unified value
            unifiedValue = currentTrend.created_at;
        }

        // Update the record's created_at to the unified value
        await Trend.updateOne({ _id: currentTrend._id }, { $set: { created_at: unifiedValue } });
    }

    console.log("All created_at values have been unified.");
}

// unifyCreatedAtValues(60).catch(console.error);

// updateCreatedAtToLastActivity()