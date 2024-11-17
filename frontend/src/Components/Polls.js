import React from "react";
import Poll from "./Poll";


function Polls(props) {
    
    
    return (
        <div className="scroll-snap">
            {props.data.map((poll) => (
                
                <Poll
                    poll_id={poll.poll_id}
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