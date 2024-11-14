import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { listen_to_messages, add_new_message } from "../apis";
import TrendProvider from "../Context/TrendProvider";
export default function TrendPage(props) {
  const { id } = useParams();
  const { trends } = useContext(TrendProvider);

  const trend = trends.find((item) => item._id === id);

  return (
    <>
      <div className="discussion-TitleBar">
        <div className="discussion-TitleBarImage">
          <img src={trend.image} />
        </div>
        <h3>{trend.name}</h3>
      </div>
    </>
  );
}
