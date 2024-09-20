import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // navigate import

function MainPage() {
  const [studies, setStudies] = useState([]);
  const navigate = useNavigate(); // navigate hook 사용

  useEffect(() => {
    // 스터디 목록을 가져오는 API 호출
    fetch('http://localhost:8080/studies')  // 백엔드의 스터디 목록 API 경로와 일치
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch studies');
        }
        return response.json();  // 응답을 JSON으로 변환
      })
      .then((data) => {
        setStudies(data);  // 스터디 데이터를 상태에 저장
      })
      .catch((error) => {
        console.error('Error fetching studies:', error);
      });
  }, []);

  // 스터디룸으로 이동하는 함수
  const goToStudyRoom = (studyId) => {
    navigate(`/study/${studyId}`);
  };

  return (
    <div>
      <h1>스터디 목록</h1>
      {/* <Rank /> */}
      <button onClick={() => {
                window.open('register', '_blank');
            }}>Open Register in New Tab</button>
      <ul>
        {studies.map((study) => (
          <li key={study.studyId}>
            <h2>{study.studyName}</h2>
            <p>{study.description}</p>
            <button onClick={() => goToStudyRoom(study.studyId)}>스터디 입장</button> {/* navigate로 스터디룸으로 이동 */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MainPage;
