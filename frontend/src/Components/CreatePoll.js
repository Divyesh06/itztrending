import {useState}from "react";
import FloatingLabelInput from "./FloatingLabelInput";
import { create_poll } from "../apis";
import { GraphUp } from "react-bootstrap-icons";
function CreatePoll(props) {
    const [question, setQuestion] = useState("");  
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const trend_id = props.trend_id
    return (
        <div className="create-poll-wrapper">
        <div className="create-poll-overlay">
        <h1><GraphUp style={{color: "var(--primary-color)", marginRight: "15px"}}/>Create Poll</h1>
        <br></br>
        <textarea placeholder="Question" onChange={(e) => setQuestion(e.target.value)}></textarea>

        <input placeholder="Option 1" onChange={(e) => setOption1(e.target.value)}/>
        <input placeholder="Option 2" onChange={(e) => setOption2(e.target.value)} />
        <br></br>
        <button onClick={function() {create_poll(trend_id, question, option1, option2)}}>Create Poll</button>
        </div>
        </div>
    )
}

export default CreatePoll;