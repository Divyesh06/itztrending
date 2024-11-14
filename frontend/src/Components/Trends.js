import React, { useState, useEffect, useContext } from "react";
import TrendCard from "./TrendCard";
import { get_trends } from "../apis";
import { useNavigate } from "react-router-dom";
import TrendProvider from "../Context/TrendProvider";


function Trends() {
  const { trends, setTrends } = useContext(TrendProvider);

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
    <div className="trend-cardContainer">
      {trends ? (
        trends.map((trendData) => (
          <TrendCard
            image={trendData.image}
            name={trendData.name}
            last_activity={trendData.last_activity}
            trend_score={trendData.trend_score}
            onClick={() => {
             trendCLickHandler(trendData._id);
            }}
          />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Trends;
