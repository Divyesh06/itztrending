
import React, { createContext, useState } from "react";


const TrendContext = createContext();




export function TrendProvider({ children }) {
    const [trends, setTrends] = useState([]); 

    const addTrend = (trend) => setTrends((prevTrends) => [...prevTrends, trend]);

    const [currentTab, setCurrentTab] = useState('');
    const [messagesState, setMessagesState] = useState([]);
    const [inputTxt, setInputTxt] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [homeTab, setHomeTab] = useState('1');


    return (
        <TrendContext.Provider value={{homeTab, setHomeTab, isLoggedIn, setIsLoggedIn,inputTxt, setInputTxt,messagesState, setMessagesState, currentTab, trends, setCurrentTab, setTrends, addTrend }}>
            {children}
        </TrendContext.Provider>
    );
}

export default TrendContext;
