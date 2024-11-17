import React, { useEffect } from "react";
import Poll from "./Poll";
import {get_polls, get_trend_polls} from "../apis";
import { useState } from "react";
import { useParams } from "react-router-dom";
var dummy_data = [
    {
        "_id": "6739d7a31250341cab20cd8e",
        "trend_id": "67399da2ad2f360bdff30f14",
        "options": ["Yes", "No"],
        "option1_count": 10,
        "option2_count": 25,
        "image": "https://images.indianexpress.com/2024/11/IND-SA-32.jpg",
        "vote_count": 0,
        "voters": [],
        "question": "Will Sanju Samson score a century",
        "__v": 0
    },
    {
        "_id": "6739d7a31250341cab20cd8e",
        "trend_id": "67399da2ad2f360bdff30f14",
        "options": ["Yes", "No"],
        "option1_count": 40,
        "option2_count": 10,
        "image": "https://images.indianexpress.com/2024/11/IND-SA-32.jpg",
        "vote_count": 0,
        "voters": [],
        "question": "Will Sanju Samson score a century",
        "__v": 0
      },
      {
        "_id": "6739d7a31250341cab20cd8e",
        "trend_id": "67399da2ad2f360bdff30f14",
        "options": ["Yes", "No"],
        "option1_count": 32,
        "option2_count": 33,
        "image": "https://images.indianexpress.com/2024/11/IND-SA-32.jpg",
        "vote_count": 0,
        "voters": [],
        "question": "Will Sanju Samson score a century",
        "__v": 0
      }
]
function Polls(props) {
    const [data, setData] = useState([])
    const { trend_id } = useParams()
    

    async function get_all_polls() {
        const polls = await get_polls()
        setData(polls)
    }

    async function get_polls_for_trend() {
        console.log(trend_id)
        const polls = await get_polls_for_trend(trend_id)
        setData(polls)
    }

    useEffect(() => {
        if (!trend_id) {
            get_all_polls()
        }
        else {
            get_polls_for_trend()
        }
    }, [])
    
    
    return (
        <div className="scroll-snap">
            {data.map((poll) => (
                
                <Poll
                    poll_id={poll._id}
                    question={poll.question}
                    options={poll.options}
                    option1_count={poll.option1_count}
                    option2_count={poll.option2_count}
                    image={poll.image}
                />
                
            ))}
        </div>
    );
}

export default Polls;