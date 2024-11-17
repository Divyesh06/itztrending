import React, { useContext, useEffect, useState } from "react";
import logo from "../Images/logo2.png";
import avatar from "../Images/avatar.png";
import createTrendIcon from "../Images/createTrend-icon.png";
import createTrendIconSelected from "../Images/createTrend-iconSelected.png";
import TrendProvider from "../Context/TrendProvider";
import HotTrendIcon from "../Images/hotTrendIcon.png";
import { ArrowRight, Search } from "react-bootstrap-icons";
import HotTrendIconSelected from "../Images/hotTrendIconSelected.png";
import { useNavigate, NavLink  } from "react-router-dom";
import TrendContext from "../Context/TrendProvider";
import Avatar from "./Avatar";
import { search } from "react-bootstrap-icons";
import { search_trends } from "../apis";
export default function Header(props) {
  const { profpic } = useContext(TrendContext);
  const { isLoggedIn, setIsLoggedIn } = useContext(TrendProvider);
  const { homeTab, setHomeTab } = useContext(TrendProvider);
  const navigate = useNavigate();
  const {searchQuery, setSearchQuery} = useContext(TrendProvider);
  const { searchResults, setSearchResults } = useContext(TrendProvider);

  const searchHandler = (e) => {
    setSearchQuery(e.target.value); // Update the state with the input value
  };

  // useEffect(() => {
  //   document
  //     .querySelectorAll(`.tab`)
  //     .forEach((tab) => tab.classList.remove("tab-active"));
  //   document.getElementById(`${homeTab}`).classList.add("tab-active");
  // }, [homeTab]);

  function Login() {
    navigate("/signup");
  }

  function tabChange(e) {
    var tabId = e.target.id;
    setSearchQuery('');
    setHomeTab(tabId);
  }

  return (
    <>
      <div className="header">
        <img className="logo" src={logo} alt="logo" />
        <div className="searchContainer">
          <Search size={20} color="grey" />
          <input
            className="search"
            placeholder="Search"
            value={searchQuery}
            onChange={searchHandler}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                console.log("Searching...");
                const result = await search_trends(searchQuery);
                console.log(result);
                setSearchResults(result)
                setHomeTab('search');
              }
            }}
          />
        </div>

        <div className="userBlock">
          {isLoggedIn ? (
            <Avatar />
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
          <div
            className={`tab ${homeTab === "1" ? "tab-active" : ""}`}
            id="1"
            onClick={tabChange}
          >
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
          <div
            className={`tab ${homeTab === "2" ? "tab-active" : ""}`}
            id="2"
            onClick={tabChange}
          >
            <img src={homeTab === "2" ? HotTrendIconSelected : HotTrendIcon} />
            Hot Trends
          </div>
          {/* <NavLink to="/polls"> */}
          <div
            className={`tab ${homeTab === "3" ? "tab-active" : ""}`}
            id="3"
            onClick={tabChange}
          >
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
          {/* </NavLink> */}
        </div>
        {/* <button className="createTrendBtn">
          <img className="createTrendIcon" alt="createTrendIcon" /> Create Trend
        </button> */}
      </div>
    </>
  );
}
