import React from "react";
import Poll from "./Poll";

var dummy_data = [
    {
        "_id": "6739d7a31250341cab20cd8e",
        "trend_id": "67399da2ad2f360bdff30f14",
        "options": ["Yes", "No"],
        "option1_count": 0,
        "option2_count": 0,
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
        "option1_count": 0,
        "option2_count": 0,
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
        "option1_count": 0,
        "option2_count": 0,
        "image": "https://images.indianexpress.com/2024/11/IND-SA-32.jpg",
        "vote_count": 0,
        "voters": [],
        "question": "Will Sanju Samson score a century",
        "__v": 0
      }
]
function Polls(props) {
    
    
    return (
        <div className="scroll-snap">
            {dummy_data.map((poll) => (
                
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