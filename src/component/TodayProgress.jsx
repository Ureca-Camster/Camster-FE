import { useSelector } from "react-redux";
import styled from "styled-components";

// 시:분:초로 변환하는 함수
const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const ProgressBarContainer = styled.div`
  width: 100%;
  margin: 20px 0;
`;

const DateText = styled.div`
  width: ${(props) => props.width}%;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: ${(props) => props.letterSpacing};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 35px;
  background-color: #ffffff;
  margin-top: 10px;
  overflow: hidden;
  border: 2px solid black;
`;

const Progress = styled.div`
  width: ${(props) => props.width}%;
  height: 35px;
  background: ${(props) =>
    props.isLoggedIn ? "#46A9FF" : "linear-gradient(90deg, #46A9FF 0%, #ffffff 90%)"};
  text-align: center;
  color: #111;
`;

const TimeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin-top: 5px;
`;

const LeftText = styled.div`
  text-align: left;
`;

const RightText = styled.div`
  text-align: right;
`;

function TodayProgress() {
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const user = useSelector((state) => state.user);

  const todayTime = user.todayTime;
  const goalTime = user.goalTime;

  const progressWidth = isLoggedIn
    ? goalTime === 0
      ? 100
      : (todayTime / goalTime) * 100
    : 100;

  // 자간 조절로 width를 꽉 채우기 위한 letterSpacing 계산
  const letterSpacing = progressWidth < 100 ? '2px' : 'normal';

  // 시간 형식으로 변환
  const todayTimeFormatted = isLoggedIn ? formatTime(todayTime) : "00:00:00";
  const goalTimeFormatted = isLoggedIn ? formatTime(goalTime) : "??:??:??";

  // 달성률
  const progressPercentage = isLoggedIn
    ? goalTime === 0
      ? 0
      : Math.floor((todayTime / goalTime) * 100)
    : "??";

  return (
    <ProgressBarContainer>
      <DateText width={progressWidth} letterSpacing={letterSpacing}>
        24-09-22 FRI
      </DateText>
      <ProgressBar>
        <Progress width={progressWidth} isLoggedIn={isLoggedIn} />
      </ProgressBar>
      <TimeInfo>
        <LeftText>{`${todayTimeFormatted} / ${goalTimeFormatted}`}</LeftText>
        <RightText>{`달성률 ${progressPercentage}%`}</RightText>
      </TimeInfo>
    </ProgressBarContainer>
  );
}

export default TodayProgress;
