import {useContext, useEffect, useState} from "react";
import HotTrendIcon from "../Images/hotTrendIcon.png";
import HotTrendIconSelected from "../Images/hotTrendIconSelected.png";
import TrendProvider from "../Context/TrendProvider";
import {ClockFill, BarChartFill, Search} from "react-bootstrap-icons"
import { signup } from "../auth_apis";
function Footer() {
    const { homeTab, setHomeTab } = useContext(TrendProvider);
    // useEffect(() => {
    //     signup("test", "test").then((res) => console.log(res))
    // })

    function tabChange(e) {
        var tabId = e.currentTarget.id;
        setHomeTab(tabId);
      }

    return (
        <div className="footer">
            <div className={`footer-tab ${homeTab==="1" ? "footer-tab-active" : ""}`}  id="1" onClick={tabChange}>
            <ClockFill size={25}/>
            <p>Today</p>
          </div>
          <div className={`footer-tab ${homeTab==="2" ? "footer-tab-active" : ""}`}  id="2" onClick={tabChange}>
            <img src={homeTab === "2" ? HotTrendIconSelected : HotTrendIcon} />
            <p>Hot</p>
          </div>
          <div className={`footer-tab ${homeTab==="3" ? "footer-tab-active" : ""}`}  id="3" onClick={tabChange}>
            <BarChartFill size={25}/>
            <p>Polls</p>
          </div>
          <div className={`footer-tab ${homeTab==="4" ? "footer-tab-active" : ""}`}  id="4" onClick={tabChange}>
            <Search size={25}/>
            <p>Search</p>
          </div>
        </div>
    );
}

export default Footer;