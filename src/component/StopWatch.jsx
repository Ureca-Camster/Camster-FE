import React, { useEffect } from 'react';

const StopWatch = ({ time, setTime }) => {
    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;

        return [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .join(" : ");
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            margin: "5px 0 10px"
        }}>
            <div className="stopwatch" style={{ 
                fontFamily: "'Krona One', sans-serif", 
                fontSize: "50px", 
                fontWeight: "500",
                width: '390px',  // 고정 너비 설정
                textAlign: 'left',  // 텍스트 왼쪽 정렬
                paddingLeft: '2px'
            }}>
                {formatTime(time)}
            </div>
        </div>
    );
};

export default StopWatch;