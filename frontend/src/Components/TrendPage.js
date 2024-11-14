import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { listen_to_messages, add_new_message } from "../apis";
import TrendProvider from "../Context/TrendProvider";
import Header from "./Header";
export default function TrendPage(props) {
  const { id } = useParams();
  const { trends } = useContext(TrendProvider);

  const trend = trends.find((item) => item._id === id);
  const { currentTab, setCurrentTab } = useContext(TrendProvider);
  const { messagesState, setMessagesState } = useContext(TrendProvider);
  const { inputTxt, setInputTxt } = useContext(TrendProvider);

  function inputChange(e) {
    setInputTxt(e.target.value);
  }

  function handleSend() {
    if (inputTxt === "") alert("Please enter a message");
    else {
      add_new_message(inputTxt, "azazaza", id);
    }
  }
  function update_messages(msgs) {
    setMessagesState(msgs);
  }

  useEffect(function(){
    listen_to_messages(id, update_messages);
  }, [])

  useEffect(() => {
    setCurrentTab("discussion");
  }, [setCurrentTab]);

  useEffect(() => {
    // console.log(currentTab);

    document
      .querySelectorAll(`.tab`)
      .forEach((tab) => tab.classList.remove("tab-active"));
    if (currentTab === "discussion") {
      document.querySelector(`#${currentTab}`).classList.add("tab-active");
    }
    if (currentTab === "game") {
      document.querySelector(`#${currentTab}`).classList.add("tab-active");
    }
  }, [currentTab]);

  return (
    <>
      <Header />
      <div className="discussion-TitleBar">
        <div className="discussion-TitleBarImage">
          <img src={trend.image} />
        </div>
        <h3>{trend.name}</h3>
      </div>
      <div className="tabs">
        <div
          className="tab tab-active"
          id="discussion"
          onClick={() => setCurrentTab("discussion")}
        >
          Discussion
        </div>
        <div className="tab" id="game" onClick={() => setCurrentTab("game")}>
          Game
        </div>
      </div>
      <div className="chats">
        <div className="message">
          <div className="others-msg">
            <div className="msg-othersProfPic"></div>
            <div className="msg-content">
              <div className="msg-content-head">
                <span className="othersProfile-chat">Nalla69</span>
                <span className="timeStamp-chat">3:00 PM</span>
              </div>
              <div className="msg-content-body">
                <p className="msg-text">Hello</p>
              </div>
            </div>
          </div>
        </div>

        <div className="message">
          <div className="others-msg">
            <div className="msg-othersProfPic"></div>
            <div className="msg-content">
              <div className="msg-content-head">
                <span className="othersProfile-chat">Gandu88</span>
                <span className="timeStamp-chat">3:00 PM</span>
              </div>
              <div className="msg-content-body">
                <p className="msg-text">
                  Fir se aagya nalle. Sale Gandu nikal yaha se
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="message">
          <div className="others-msg">
          <div className="msg-othersProfPic"></div>
            <div className="msg-content">
              <div className="msg-content-head">
                <span className="othersProfile-chat">You</span>
                <span className="timeStamp-chat">3:00 PM</span>
              </div>
              <div className="msg-content-body">
                <p className="msg-text">
                  Tum dono hi alle ho jo idhar aagye. Kon hi aata hai idhar. abe
                  saale gandu nikal yaha se
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="message">
        {messagesState.map((msg, index) => (
            <div key={index} className="message">
              <p>{msg.message}</p>
              <span>{msg.user_id}</span>
            </div>
          ))}
        </div> */}
      </div>
      <div id="footer">
        <div className="inputBoxContainer">
          <input
            type="text"
            value={inputTxt}
            onChange={inputChange}
            className="msgInputBox"
          />
          <button className="sendBtn" onClick={handleSend}>
            <i
              class="material-icons"
              style={{ color: "#4C67C1", cursor: "pointer" }}
            >
              send
            </i>
          </button>
        </div>
      </div>
    </>
  );
}
