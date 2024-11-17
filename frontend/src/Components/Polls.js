import React from "react";
import Poll from "./Poll";

var dummy_polls_data = [
    {
        poll_id: "1",
        question: "Who will win the election?",
        options: ["Donald Trump", "Kamala Harris"],
        option1_count: 15, 
        option2_count: 5,
        image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Donald_Trump_official_portrait.jpg",
    },
    {
        poll_id: "2",
        question: "Should AI tools be regulated?",
        options: ["Yes", "No"],
        option1_count: 25,
        option2_count: 10,
        image: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Artificial_intelligence_technology.jpg",
    },
    {
        poll_id: "3",
        question: "Is climate change the biggest global threat?",
        options: ["Yes", "No"],
        option1_count: 30,
        option2_count: 20,
        image: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Glacier_in_the_Arctic.jpg",
    },
    {
        poll_id: "4",
        question: "Which is the better streaming platform?",
        options: ["Netflix", "Disney+"],
        option1_count: 40,
        option2_count: 25,
        image: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Netflix_logo.svg",
    },
    {
        poll_id: "5",
        question: "Will SpaceX achieve its Mars mission before 2030?",
        options: ["Yes", "No"],
        option1_count: 18,
        option2_count: 12,
        image: "https://upload.wikimedia.org/wikipedia/commons/9/91/SpaceX_Starship_SN15_test_flight.jpg",
    },
    {
        poll_id: "6",
        question: "Is remote work here to stay?",
        options: ["Yes", "No"],
        option1_count: 35,
        option2_count: 15,
        image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Home_office_setup.jpg",
    },
    {
        poll_id: "7",
        question: "Who will win the Cricket World Cup?",
        options: ["India", "Australia"],
        option1_count: 55,
        option2_count: 45,
        image: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Cricket_World_Cup_trophy.jpg",
    },
    {
        poll_id: "8",
        question: "Which social media platform do you use most?",
        options: ["Instagram", "TikTok"],
        option1_count: 60,
        option2_count: 50,
        image: "https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg",
    },
    {
        poll_id: "9",
        question: "Will electric vehicles dominate by 2040?",
        options: ["Yes", "No"],
        option1_count: 28,
        option2_count: 22,
        image: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Tesla_Model_S_parked.jpg",
    },
    {
        poll_id: "10",
        question: "Which city is better for tech startups?",
        options: ["San Francisco", "Austin"],
        option1_count: 32,
        option2_count: 18,
        image: "https://upload.wikimedia.org/wikipedia/commons/a/a8/San_Francisco_skyline.jpg",
    },
];


function Polls(props) {
    
    
    return (
        <div className="scroll-snap">
            {dummy_polls_data.map((poll) => (
                
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