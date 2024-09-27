import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styled, { createGlobalStyle } from "styled-components";
import WebFont from 'webfontloader';

const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: 'Paperlogy-8ExtraBold';
        src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-8ExtraBold.woff2') format('woff2');
        font-weight: 600;
        font-style: normal;
    }
    @font-face {
        font-family: 'Krona One';
        src: url('https://fonts.gstatic.com/s/kronaone/v14/jAnEgHdjHcjgfIb1ZcUCMY-h.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
    }
`;

const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const ProgressBarContainer = styled.div`
    width: 100%;
    margin: 0;
`;

const DateTextContainer = styled.div`
    width: 100%;
    overflow: hidden;
`;

const DateText = styled.div`
    display: inline-block;
    text-align: left;
    font-weight: 700;
    font-size: 3.2rem;
    font-family: 'Krona One', sans-serif;
    line-height: 1.2;
    white-space: nowrap;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-shadow: 0.5px 0 0 currentColor;
    transform: translateZ(0);
    will-change: transform;
    color: #000;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ProgressBar = styled.div`
    width: 100%;
    height: 35px;
    background-color: #ffffff;
    overflow: hidden;
    border: 2px solid black;
`;

const Progress = styled.div`
    width: ${(props) => props.width}%;
    height: 35px;
    background: ${(props) =>
        props.isLoggedIn ? "#46A9FF" : "linear-gradient(90deg, #46A9FF 0%, #ffffff 90%)"};
`;

const TimeInfo = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 1.5rem;
    margin-top: 5px;
`;

const LeftText = styled.div`
    text-align: left;
    font-family: 'Krona One', sans-serif;
`;

const RightText = styled.div`
    text-align: right;
`;

const AchievementText = styled.span`
    font-family: 'Paperlogy-8ExtraBold', sans-serif;
`;

const PercentageText = styled.span`
    font-family: 'Krona One', sans-serif;
`;

function TodayProgress() {
    const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
    const user = useSelector((state) => state.user);
    const [currentDate, setCurrentDate] = useState('');
    const [fontLoaded, setFontLoaded] = useState(false);
    const dateTextRef = useRef(null);

    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Krona One']
            },
            active: () => setFontLoaded(true)
        });
    }, []);

    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][now.getDay()];
        setCurrentDate(`${year}-${month}-${day} ${dayOfWeek}`);
    }, []);

    const todayTime = user.todayTime;
    const goalTime = user.goalTime;

    const progressWidth = isLoggedIn
        ? goalTime === 0
            ? 100
            : Math.min((todayTime / goalTime) * 100, 100)
        : 100;

    useEffect(() => {
        if (dateTextRef.current && fontLoaded) {
            const containerWidth = dateTextRef.current.offsetWidth;
            const textWidth = dateTextRef.current.scrollWidth;
            if (textWidth > containerWidth) {
                const scale = containerWidth / textWidth;
                dateTextRef.current.style.transform = `scaleX(${scale})`;
                dateTextRef.current.style.transformOrigin = 'left';
            } else {
                dateTextRef.current.style.transform = 'none';
            }
        }
    }, [currentDate, fontLoaded]);

    const todayTimeFormatted = isLoggedIn ? formatTime(todayTime) : "00:00:00";
    const goalTimeFormatted = isLoggedIn ? formatTime(goalTime) : "??:??:??";

    const progressPercentage = isLoggedIn
        ? goalTime === 0
            ? 0
            : Math.floor((todayTime / goalTime) * 100)
        : "??";

    if (!fontLoaded) return null;
    return (
        <>
            <GlobalStyle />
            <ProgressBarContainer>
                <DateTextContainer style={{width: `${progressWidth}%`}}>
                    <DateText ref={dateTextRef}>
                        {currentDate}
                    </DateText>
                </DateTextContainer>
                <ProgressBar>
                    <Progress width={progressWidth} isLoggedIn={isLoggedIn} />
                </ProgressBar>
                <TimeInfo>
                    <LeftText>{`${todayTimeFormatted} / ${goalTimeFormatted}`}</LeftText>
                    <RightText>
                        <AchievementText>달성률 </AchievementText>
                        <PercentageText>{progressPercentage}%</PercentageText>
                    </RightText>
                </TimeInfo>
            </ProgressBarContainer>
        </>
    );
}

export default TodayProgress;