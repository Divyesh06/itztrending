
import React, { createContext, useState } from "react";


const TrendContext = createContext();




export function TrendProvider({ children }) {
    const [trends, setTrends] = useState([]); 

    const addTrend = (trend) => setTrends((prevTrends) => [...prevTrends, trend]);

    return (
        <TrendContext.Provider value={{ trends, setTrends, addTrend }}>
            {children}
        </TrendContext.Provider>
    );
}

export default TrendContext;
