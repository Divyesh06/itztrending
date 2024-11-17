import React, { createContext, useState, useEffect } from "react";
import { check_auth } from "../auth_apis";
import { useNavigate } from "react-router-dom";

export const TrendContext = createContext();

export function TrendProvider({ children }) {
  const [trends, setTrends] = useState([]);
  const addTrend = (trend) => setTrends((prevTrends) => [...prevTrends, trend]);
  const [hotTrends, setHotTrends] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("discussion");
  const [messagesState, setMessagesState] = useState([]);
  const [inputTxt, setInputTxt] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [homeTab, setHomeTab] = useState("1");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profpic, setProfpic] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('')
  // const [searchResults, setSearchResults] = useEffect([]);

  return (
    <TrendContext.Provider
      value={{
        searchQuery, setSearchQuery,
        
        searchResults,
        setSearchResults,
        hotTrends,
        setHotTrends,
        isLoading,
        setisLoading,
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
