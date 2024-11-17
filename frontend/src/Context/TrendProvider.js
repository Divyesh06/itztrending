import React, { createContext, useState } from "react";
// import { check_auth } from "../auth_apis";

const TrendContext = createContext();

export function TrendProvider({ children }) {
  const [trends, setTrends] = useState([]);

  const addTrend = (trend) => setTrends((prevTrends) => [...prevTrends, trend]);

  const [currentTab, setCurrentTab] = useState("");
  const [messagesState, setMessagesState] = useState([]);
  const [inputTxt, setInputTxt] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [homeTab, setHomeTab] = useState("1");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profpic, setProfpic] = useState(null);





  return (
    <TrendContext.Provider
      value={{
        profpic,
        setProfpic,
        username,
        setUsername,
        password,
        setPassword,
        email,
        setEmail,
        homeTab,
        setHomeTab,
        isLoggedIn,
        setIsLoggedIn,
        inputTxt,
        setInputTxt,
        messagesState,
        setMessagesState,
        currentTab,
        trends,
        setCurrentTab,
        setTrends,
        addTrend,
      }}
    >
      {children}
    </TrendContext.Provider>
  );
}

export default TrendContext;
