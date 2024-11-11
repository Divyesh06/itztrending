//Boilerplate

import React from 'react';
import TrendCard from './TrendCard';
import { get_trends } from '../apis';

function Trends() {
    const trends = get_trends().then(data => return (
        <></>    
    ))
    

}

export default Trends