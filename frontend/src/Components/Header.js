import React, { useContext, useEffect } from "react";
import logo from "../Images/logo2.png";
import avatar from "../Images/avatar.png";
import createTrendIcon from "../Images/createTrend-icon.png";
import createTrendIconSelected from "../Images/createTrend-iconSelected.png";
import TrendProvider from "../Context/TrendProvider";
import HotTrendIcon from "../Images/hotTrendIcon.png";
import {ArrowRight} from "react-bootstrap-icons"
import HotTrendIconSelected from "../Images/hotTrendIconSelected.png";
export default function Header() {
  const { isLoggedIn, setIsLoggedIn } = useContext(TrendProvider);
  const { homeTab, setHomeTab } = useContext(TrendProvider);

  // useEffect(() => {
  //   document
  //     .querySelectorAll(`.tab`)
  //     .forEach((tab) => tab.classList.remove("tab-active"));
  //   document.getElementById(`${homeTab}`).classList.add("tab-active");
  // }, [homeTab]);

  function Login(){
    setIsLoggedIn(!isLoggedIn);
  }

  function tabChange(e) {
    var tabId = e.target.id;
    setHomeTab(tabId);
  }

  return (
    <>
      <div className="header">
        <img className="logo" src={logo} alt="logo" />
        <div className="searchContainer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            //   width="20"
            //   height="20"
            fill="grey"
            class="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
          <input className="search" placeholder="Search" />
        </div>

        <div className="userBlock">
        
          {isLoggedIn ? (
            <img className="avatar" src={avatar} alt="avatar" />
          ) : (
            <button className="btnPrimary" onClick={Login}>
              
              Get Started 
              <ArrowRight></ArrowRight>
            </button>
          )}
        </div>
      </div>
      <div className="bottomHeader">
        <div className="tabs">
          <div className={`tab ${homeTab==="1" ? "tab-active" : ""}`}  id="1" onClick={tabChange}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-clock-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
            </svg>
            Today's Trends
          </div>
          <div className={`tab ${homeTab==="2" ? "tab-active" : ""}`} id="2" onClick={tabChange}>
            <img src={homeTab === "2" ? HotTrendIconSelected : HotTrendIcon} />
            Hot Trends
          </div>
          <div className={`tab ${homeTab==="3" ? "tab-active" : ""}`} id="3" onClick={tabChange}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-bar-chart-line-fill"
              viewBox="0 0 16 16"
            >
              <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1z" />
            </svg>
            Top Polls
          </div>
        </div>
        <button className="createTrendBtn">
          <img className="createTrendIcon" alt="createTrendIcon" /> Create Trend
        </button>
      </div>
    </>
  );
}
