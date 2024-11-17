import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get_trends } from "../apis";
import { useParams } from "react-router-dom";
import { listen_to_messages, add_new_message } from "../apis";
import TrendProvider from "../Context/TrendProvider";
import { Send, PlusCircle, GraphUp,  Chat } from "react-bootstrap-icons";
import Header from "./Header";
import Popover from "./Popover";
import CreatePoll from "./CreatePoll";
export default function TrendPage(props) {
  const navigate = useNavigate();
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const { id } = useParams();
  const {
    isLoading,
    setisLoading,
    setTrends,
    trends,
    isLoggedIn,
    setIsLoggedIn,
    currentTab,
    setCurrentTab,
    messagesState,
    setMessagesState,
    inputTxt,
    setInputTxt,
  } = useContext(TrendProvider);

  const trend = trends ? trends.find((item) => item._id === id) : null;

  useEffect(() => {
    if (trends.length === 0) {
      // Check if trends are already present
      get_trends()
        .then((data) => {
          setTrends(data); // Set trends in context if they are empty
        })
        .catch((error) => {
          console.error("Error fetching trends:", error);
        });
    }
  }, [trends, setTrends]);

  useEffect(() => {
    const chatContainer = document.querySelector(".chatEndtoScroll");
    if (chatContainer) chatContainer.scrollIntoView({ behavior: "smooth" });
  }, [messagesState]);

  function inputChange(e) {
    setInputTxt(e.target.value);
  }

  function handleSend() {
    if (inputTxt === "") {
      alert("Please enter a message");
    } else {
      add_new_message(inputTxt, id);
      setInputTxt("");
    }
  }

  function update_messages(msgs) {
    setMessagesState(msgs);
  }

  useEffect(() => {
    listen_to_messages(id, update_messages);
  }, [id]);

  useEffect(() => {
    if (isLoggedIn) {
      setCurrentTab("chat");
    }
  }, [isLoggedIn, setCurrentTab]);

  useEffect(() => {
    if (isLoggedIn) {

      if (currentTab === "poll") {
        document.querySelector(`#${currentTab}`).classList.add("tab-active");
      if (currentTab === "discussion" || currentTab === "game") {
        const tabElement = document.querySelector(`#${currentTab}`);
        if (tabElement) tabElement.classList.add("tab-active");
      }
    }
  }}, [currentTab, isLoggedIn]);

  // Display a loading state or fallback if trend is not found
  if (!trend) {
    return <div>Loading trend details...</div>;
  }

  return (
    <>
      {overlayVisible? <CreatePoll trend_id={trend._id} hide={() => setOverlayVisible(false)}/> : null}
      <div className="discussion-TitleBar">
        <div className="discussion-TitleBarImage">
          <img src={trend.image} alt={trend.name || "Trend"} />
        </div>
        <h3>{trend.name}</h3>
      </div>
      <div
        className="tabs"
        style={{ padding: "0 20px", backgroundColor: "var(--headerBG)" }}
      >
        <div
          className={`tab ${currentTab === "discussion" ? "tab-active" : ""}`}
          id="discussion"
          onClick={() => setCurrentTab("discussion")}
        >
          Discussion
        </div>
        <div
          className={`tab ${currentTab === "game" ? "tab-active" : ""}`}
          id="game"
          onClick={() => setCurrentTab("game")}
        >
          Game
        </div>
      </div>

      {currentTab === "discussion" ? (
        <>

          <div className="chats">
            {messagesState.map((msg, index) => (
              <div key={index} className="message">
                <div className="others-msg">
                  <div className="msg-othersProfPic">
                    <img src={msg.sent_profpic} alt="Profile" />
                  </div>
                  <div className="msg-content">
                    <div className="msg-content-head">
                      <span className="othersProfile-chat">
                        {msg.sent_username}
                      </span>
                      <span className="timeStamp-chat">
                        {new Date(msg.created_at)
                          .toISOString()
                          .split("T")[1]
                          .slice(0, 5)}
                      </span>
                    </div>
                    <div className="msg-content-body">
                      <p className="msg-text">{msg.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="chatEndtoScroll"></div>
          </div>

          <div id="chat-footer">
            <div className="inputBoxContainer">
            <button className="plusBtn" style={inputTxt.length ? {display: "none"} : {display: "block"}} onClick={() => setPopoverVisible(!popoverVisible)}>
              <PlusCircle />
              {popoverVisible? <Popover>
                  <div onClick={function() {setOverlayVisible(true)}}><GraphUp style={{marginRight: "12px"}}/>Create a Poll</div>
                  <div><Chat style={{marginRight: "12px"}}/>Share Opinion</div>
              </Popover> : null}
              
            </button>
            <input
                type="text"
                value={inputTxt}
                placeholder="Type your message..."
              onChange={inputChange}
                className="msgInputBox"
              />
              <button className="sendBtn" onClick={handleSend} disabled={inputTxt.length == 0}>
                <Send />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="commingSoon">Comming Soon</div>
      )}
    </>
  );
}
