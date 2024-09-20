import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // navigate import 추가

function StudyRoomPage() {
  const { studyNo } = useParams();  // URL에서 studyNo 파라미터 가져오기
  const [studyRoom, setStudyRoom] = useState(null);
  const [posts, setPosts] = useState([]);  // 게시판 목록
  const navigate = useNavigate();  // navigate 훅 사용
  const isLoggedIn = false; // 로그인 여부 확인 (임시로 false로 설정)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");  // 로그인하지 않은 상태면 로그인 페이지로 이동
      return;
    }

    // 스터디룸 정보를 가져오는 API 호출 (fetch 사용)
    fetch(`http://localhost:8080/studies/${studyNo}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch study room data');
        }
        return response.json();  // 응답을 JSON으로 변환
      })
      .then((data) => {
        setStudyRoom(data);  // 스터디룸 데이터를 상태에 저장
      })
      .catch((error) => {
        console.error("스터디룸 정보를 불러오는데 실패했습니다.", error);
      });

    // 게시판 목록을 가져오는 API 호출
    fetch(`http://localhost:8080/studies/${studyNo}/posts`)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);  // 게시판 목록 데이터를 상태에 저장
      })
      .catch((error) => {
        console.error("게시판 목록을 불러오는데 실패했습니다.", error);
      });
  }, [studyNo, isLoggedIn, navigate]);

  if (!studyRoom) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px", maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
      {/* 왼쪽: 스터디 제목, 설명, 인원수, 버튼들 */}
      <div style={{ flex: "4", border: "1px solid #ccc", padding: "20px", borderRadius: "10px" }}>
        <h1>{studyRoom.studyName} 스터디룸</h1>
        
        {/* 설명을 감싸는 추가된 상자 */}
        <div style={{ position: "relative", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
          <p>{studyRoom.description}</p>
          
          {/* 연필 아이콘 - 우측 하단 */}
          <img 
            src="https://cdn-icons-png.flaticon.com/512/84/84380.png" 
            alt="Edit" 
            style={{ position: "absolute", bottom: "10px", right: "10px", width: "20px", height: "20px" }}
          />
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", marginTop: "20px" }}>
          <span>인원수: {studyRoom.memberCount}명</span>
          <button style={{ padding: "5px 10px", cursor: "pointer"}}>목록 보기</button>
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <button style={{ padding: "10px 20px"}}>
            캠스터디 시작하기
          </button>
          <button style={{ padding: "10px 20px"}}>
            탈퇴
          </button>
        </div>
      </div>

      {/* 오른쪽: 게시판 목록 */}
      <div style={{ flex: "6", border: "1px solid #ccc", padding: "20px", borderRadius: "10px", position: "relative" }}>
        <button>+</button>새 게시물을 작성하세요
        <button onClick={() => navigate("/")}>뒤로</button> {/* 뒤로가기 버튼 */}
      </div>
    </div>
  );
}

export default StudyRoomPage;
