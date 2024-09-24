// MainPage.jsx
import React from 'react';
import Rank from '../component/Rank';
import TodayProgress from '../component/TodayProgress';

function MainPage(props) {

    return (
        <div>
            <h1>MainPage</h1>
            <TodayProgress />
            <Rank />
            <button onClick={() => {
                window.open('register', '_blank');
            }}>Open Register in New Tab</button>
        </div>
    );
}

export default MainPage;
