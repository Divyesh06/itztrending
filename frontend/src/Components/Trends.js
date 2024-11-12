import React, { useState, useEffect } from 'react';
import TrendCard from './TrendCard';
import { get_trends } from '../apis';

function Trends() {
    const [trends, setTrends] = useState(null);

    useEffect(() => {
        get_trends().then(data => {
            setTrends(data);
        }).catch(error => {
            console.error("Error fetching trends:", error);
        });
    }, []);

    return (
        
        <div className="trend-cardContainer">
            {trends ? (
                trends.map(trendData =>
                    <TrendCard 
                        image={trendData.image} 
                        name={trendData.name} 
                        last_activity={trendData.last_activity} 
                        trend_score={trendData.trend_score} 
                    />
                )
                
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Trends;
