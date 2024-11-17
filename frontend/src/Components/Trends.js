import React, { useState, useEffect, useContext } from "react";
import TrendCard from "./TrendCard";
import { get_trends } from "../apis";
import { useNavigate } from "react-router-dom";
import TrendProvider from "../Context/TrendProvider";
import Header from "./Header";
import { check_auth } from "../auth_apis";

function Trends() {
  const { isLoggedIn, setIsLoggedIn } = useContext(TrendProvider);
  const { profpic, setProfpic } = useContext(TrendProvider);
  const { username, setUsername } = useContext(TrendProvider);
  const { messagesState, setMessagesState } = useContext(TrendProvider);

  useEffect(() => {
    async function authChecking() {
      try {
        const [initAuth_success, initAuth_response] = await check_auth();
        if (initAuth_success) {
          if (initAuth_response.user._id) {
            setProfpic(initAuth_response.user.profpic);
            setUsername(initAuth_response.user.username);
            console.log(initAuth_response);

            setIsLoggedIn(true);
          } else {
            console.log(initAuth_response);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    authChecking();
  }, []);
  const { trends, setTrends } = useContext(TrendProvider);
  const { homeTab, setHomeTab } = useContext(TrendProvider);

  const navigate = useNavigate();

  const trendCLickHandler = (id) => {
    navigate(`/trend/${id}`);
  };

  useEffect(() => {
    get_trends()
      .then((data) => {
        setTrends(data);
      })
      .catch((error) => {
        console.error("Error fetching trends:", error);
      });
  }, []);

  return (
    <>
      <Header />
      {(() => {
        switch (homeTab) {
          case "1":
            return (
              <div className="trend-cardContainer">
                {trends ? (
                  trends.map((trendData) => (
                    <TrendCard
                      key={trendData._id}
                      image={trendData.image}
                      name={trendData.name}
                      last_activity={trendData.last_activity}
                      trend_score={trendData.trend_score}
                      onClick={() => trendCLickHandler(trendData._id)}
                    />
                  ))
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            );
          
          case "2":
            return <div className="commingSoon">Comming Soon</div>
          
          case "3":
            return <div className="commingSoon">Comming Soon</div>
            
          default:
            return null; // Return something or null for default cases
        }
      })()}
    </>
  );
}

export default Trends;
