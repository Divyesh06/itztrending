import React, { useEffect } from "react";
import Poll from "./Poll";
import {get_polls, get_trend_polls} from "../apis";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import TrendProvider from "../Context/TrendProvider";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Polls(props) {
    const [data, setData] = useState([])
    const { trend_id } = useParams();
    const navigate = useNavigate();
    const { homeTab, setHomeTab } = useContext(TrendProvider);
    async function get_all_polls() {
        const polls = await get_polls()
        if (polls.length === 0) {
            
            setTimeout(() =>toast.warn("No Polls Found"), 1)
            return
        }
        setData(polls)
    }

    async function go_back() {
        if (!trend_id) {
            navigate("/");
            setHomeTab("1");
        }
        else {
            navigate(`/trends/${trend_id}`);
        }
    }

    async function get_polls_for_trend() {
        const polls = await get_trend_polls(trend_id)
        if (polls.length === 0) {
            
            setTimeout(() =>toast.warn("No Polls Found"), 1)
            return
        }
        setData(polls)
    }

    useEffect(() => {
        if (!trend_id) {
            get_all_polls()
        }
        else {
            get_polls_for_trend(trend_id)
        }
    }, [])
    
    
    return (
        <div className="scroll-snap">
            <ToastContainer />
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