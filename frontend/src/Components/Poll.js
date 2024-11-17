import { useState,useContext } from "react";
import {ArrowLeft} from "react-bootstrap-icons"
import TrendProvider from "../Context/TrendProvider";
import { vote_on_poll } from "../apis";


function Poll(props) {

    const { homeTab, setHomeTab,setCurrentTab } = useContext(TrendProvider);
    
    var option1_count = props.option1_count
    var option2_count = props.option2_count

    const [option1, setOption1] = useState(option1_count)
    const [option2, setOption2] = useState(option2_count)
    const [voted, setVoted] = useState(false)

    function vote(e) {
        var option = e.currentTarget.id
        if (voted) {
            return
        }
        setVoted(true)
        if (option == 1) {
            setOption1(option1 + 1)
            vote_on_poll(props.poll_id, option)

        } else {
            setOption2(option2 + 1)
            vote_on_poll(props.poll_id, option)
        }
    }

    function go_back() {
        setHomeTab("1");
        setCurrentTab('discussion');
        window.history.back();
    }

    function getPercentage(option) {
        return `${Math.round(option / (option1 + option2) * 100)}%`
    }

    return (
        <>
            <div className="poll-wrapper">
                
                    <div className="poll" style={{ backgroundImage: `url(${props.image})` }}>
                        <div className="poll-question"><ArrowLeft style={{marginRight:"15px", cursor:"pointer"}} onClick={go_back}/>{props.question}</div>
                        <div className="poll-options-container">
                            <div className="poll-options" onClick={vote} style={voted ? { height: getPercentage(option1) } : {}} id="1">
                                <p>{voted ? getPercentage(option1) : props.options[0]}</p>
                            </div>
                            <div className="poll-options" onClick={vote} style={voted ? { height: getPercentage(option2) } : {}} id="2">
                                <p>{voted ? getPercentage(option2) : props.options[1]}</p>
                            </div>
                        </div>
                    </div>
                
            </div>

        </>
    )
}

export default Poll