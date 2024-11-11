// Boilerplate

import React from 'react';

function TrendCard(props) {
    return (
        <div className="trend-card" style={{backgroundImage: `url(${props.image})`}}>
            <div className='card-overlay'>
                <p>{props.name}</p>
                <div className='card-overlay-line'>
                    <p>{props.last_activity}</p>
                    <p>{props.trend_score}</p>
                </div>
                
            </div>
            
        </div>
    );
}

export default TrendCard