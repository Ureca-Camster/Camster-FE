import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import WebFont from 'webfontloader';
import { useAppSelector } from "../../store/hooks.ts";

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
    margin-bottom: -10px;
`;

const DateText = styled.div`
    display: inline-block;
    text-align: left;
    font-weight: 500;
    -webkit-text-stroke: 2px black;
    font-size: 3.2rem;
    font-family: 'Krona One', sans-serif;
    line-height: 1.2;
    white-space: nowrap;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transform: translateZ(0);
    will-change: transform;
    color: #000;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 5px;
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
    border-right: ${(props) => props.width < 100 && props.width > 0 ? '2px solid black' : 'none'};
    background: ${(props) =>
        props.isLoggedIn ? "#46A9FF" : "linear-gradient(90deg, #46A9FF 0%, #ffffff 90%)"};
`;

const TimeInfo = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 1.7rem;
    margin-top: 2px;
`;

const LeftText = styled.div`
    text-align: left;
    font-family: 'Krona One', sans-serif;
`;

const RightText = styled.div`
    text-align: right;
`;

const AchievementText = styled.span`
    font-family: 'Paperlogy-5Medium', sans-serif;
    letter-spacing: 2px;
`;

const PercentageText = styled.span`
    font-family: 'Krona One', sans-serif;
`;

function TodayProgress() {
    const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn);
    const user = useAppSelector((state) => state.user);
    const [currentDate, setCurrentDate] = useState('');
    const [fontLoaded, setFontLoaded] = useState(false);
    const dateTextRef = useRef(null);
    const [todayTime, setTodayTime] = useState(null);

    const fetchTodayTime = async () => {
        try {
          const response = await fetch('/members/time');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setTodayTime(data);
        } catch (error) {
          console.error('Error fetching today time:', error);
        }
    };

    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Krona One']
            },
            active: () => setFontLoaded(true)
        });
    }, []);

    useEffect(() => {
        fetchTodayTime();
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][now.getDay()];
        setCurrentDate(`${year}-${month}-${day} ${dayOfWeek}`);
    }, []);

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
        <ProgressBarContainer>
            <DateTextContainer>
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
    );
}

export default TodayProgress;