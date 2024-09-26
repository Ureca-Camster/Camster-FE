import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppSelector } from '../store/hooks.ts'; // Redux의 상태 가져오기
import { FaUser, FaEdit } from 'react-icons/fa';  // 설치 필요: npm install react-icons

function StudyRoomPage() {
  const { studyNo } = useParams();  // URL에서 studyNo 파라미터 가져오기
  const [studyRoom, setStudyRoom] = useState(null);
  const [posts, setPosts] = useState([]);  // 게시판 목록
  const [isMember, setIsMember] = useState(false);  // 스터디 가입 여부 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  // 수정 모달 상태
  const [editedDescription, setEditedDescription] = useState("");  // 수정될 설명 상태
  const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 상태 관리
  const [isMemberListOpen, setIsMemberListOpen] = useState(false);  // 멤버 목록 모달 상태
  const [postTitle, setPostTitle] = useState(""); // 게시물 제목 상태 관리
  const [postContent, setPostContent] = useState(""); // 게시물 내용 상태 관리
  const [members, setMembers] = useState([]);  // 가입된 멤버 목록
  const [memberCount, setMemberCount] = useState(0);  // 가입된 멤버 수
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn);  // Redux에서 로그인 상태 가져오기
  const user = useAppSelector((state) => state.user);  // Redux에서 사용자 정보 가져오기

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");  // 로그인하지 않은 상태면 로그인 페이지로 이동
      return;
    }

    // 스터디룸 정보를 가져오는 API 호출
    fetch(`http://localhost:8080/studies/${studyNo}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch study room data');
        }
        return response.json();  // 응답을 JSON으로 변환
      })
      .then(data => {
        setStudyRoom(data);  // 스터디룸 데이터를 상태에 저장
        setEditedDescription(data.description);  // 수정 시 기본값으로 설명 설정
      })
      .catch(error => {
        console.error("스터디룸 정보를 불러오는데 실패했습니다.", error);
      });

    // 스터디 가입 여부 확인 및 멤버 수/목록 가져오는 API 호출
    fetch(`http://localhost:8080/studies/${studyNo}/members`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMemberCount(data.length); // 멤버 수 상태 업데이트
          setMembers(data); // 멤버 목록 상태 업데이트
          const isUserMember = data.some(member => member.memberId === user.id);
          setIsMember(isUserMember);  // 가입 여부 업데이트
        } else {
          console.error("Invalid data format:", data);
        }
      })
      .catch((error) => {
        console.error("Failed to check membership status and fetch members:", error);
      });

    // 게시물 목록을 가져오는 API 호출 추가
    fetch(`http://localhost:8080/boards/study/${studyNo}`)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);  // 게시물 목록을 상태에 저장
      })
      .catch((error) => {
        console.error("Failed to fetch posts:", error);
      });
  }, [studyNo, isLoggedIn, navigate, user.id]);

  // 수정 모달 열기/닫기
  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  // 모달을 열거나 닫는 함수
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // 멤버 목록 모달을 열거나 닫는 함수
  const toggleMemberListModal = () => {
    setIsMemberListOpen(!isMemberListOpen);
  };

  // 설명 수정 함수 (수정 확인 메시지 추가)
  const handleDescriptionUpdate = () => {
    if (window.confirm("정말로 수정하시겠습니까?")) {
      const updatedStudyRoom = {
        ...studyRoom,
        description: editedDescription,
      };

      fetch(`http://localhost:8080/studies/${studyNo}?loggedInMemberId=${user.memberId}`, {
        method: 'PUT',  // PUT 요청으로 수정
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStudyRoom)
      })
      .then(response => response.json())
      .then(data => {
        setStudyRoom(data);  // 수정된 스터디룸 데이터를 상태에 저장
        toggleEditModal();  // 모달 닫기
        alert("수정이 완료되었습니다.");  // 수정 완료 후 알림
      })
      .catch(error => {
        console.error("스터디룸 설명 수정에 실패했습니다.", error);
        alert("수정에 실패했습니다.");  // 수정 실패 시 알림
      });
    }
  };

  // 게시물 제출 함수
  const handlePostSubmit = () => {
    if (window.confirm("등록 하시겠습니까?")){
    const newPost = {
      title: postTitle,
      content: postContent,
      memberId: user.memberId,  // 로그인한 유저의 ID
      nickname: user.nickname,
      studyId: studyNo,  // 현재 스터디 ID
    };

    fetch('http://localhost:8080/boards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost)
    })
      .then(response => response.json())
      .then(data => {
        setPosts([...posts, data]);  // 새로 등록한 게시물을 게시판 목록에 추가
      })
      .catch(error => {
        console.error("Failed to submit post:", error);
      });

    setIsModalOpen(false);  // 모달 닫기
    setPostTitle("");  // 제목 초기화
    setPostContent("");  // 내용 초기화
    }
  };

  if (!studyRoom) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px", maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
      {/* 왼쪽: 스터디 제목, 설명, 인원수, 버튼들 */}
      <div style={{ 
        flex: "4", 
        border: "1px solid #8BC9FF", 
        padding: "20px", 
        borderRadius: "10px", 
        height: "500px",  // 고정된 높이 설정
        overflow: "auto"  // 내용이 많아질 경우 스크롤 생성
      }}>
        <h1>{studyRoom.studyName} 스터디룸</h1>

        {/* 설명을 감싸는 추가된 상자 */}
        <div style={{ position: "relative", padding: "20px", border: "1px solid #8BC9FF", borderRadius: "10px" }}>
          <p>{studyRoom.description}</p>
          {/* 연필 아이콘 (로그인한 유저가 스터디 방을 만들었을 때만 보임) */}
          {user.memberId === studyRoom.memberId && (
            <FaEdit
              style={{ position: "absolute", bottom: "10px", right: "10px", cursor: "pointer", width: "20px", height: "20px" }}
              onClick={toggleEditModal}  // 클릭하면 수정 모달 열기
            />
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", marginTop: "20px" }}>
          <span style={{ display: "flex", alignItems: "center" }}>
            <FaUser style={{ marginRight: "8px" }} /> {memberCount}명
          </span>
          <button className="custom-btn" onClick={toggleMemberListModal}>목록 보기</button>
        </div>
      </div>

      {/* 멤버 목록 팝업 */}
      {isMemberListOpen && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "30px",
          width: "400px",
          backgroundColor: "#fff",
          border: "1px solid #8BC9FF",
          borderRadius: "10px",
          zIndex: 1000,
        }}>
          <h2>가입된 멤버 목록</h2>
          <ul>
            {members.map(member => (
              <li key={member.memberId}>{member.nickname}</li>
            ))}
          </ul>
          <button className="custom-btn" onClick={toggleMemberListModal}>닫기</button>
        </div>
      )}

      {/* 오른쪽: 게시판 목록 */}
      <div style={{ 
        flex: "6", 
        border: "1px solid #8BC9FF", 
        padding: "20px", 
        borderRadius: "10px", 
        maxHeight: "500px",  // 고정된 높이 설정
        overflowY: "auto"  // 스크롤 생성
      }}>
        <button className="custom-btn" onClick={toggleModal}>+</button>  새 게시물을 작성하세요

        {/* 게시물 목록을 표시하는 부분 */}
        <div style={{ marginTop: "20px" }}>
          {posts.length > 0 ? (
            <ul>
              {posts.map((post) => (
                <li key={post.boardId} style={{ marginBottom: "10px", borderBottom: "1px solid #8BC9FF", paddingBottom: "10px" }}>
                  <Link to={`/post/${post.boardId}`}>
                    <h3>{post.title}</h3>
                  </Link>
                  <h5>{post.content}</h5>
                  <p>작성자: {post.nickname || "알 수 없음"}</p>
                  <p>작성일: {new Date(post.createDate).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>게시물이 없습니다.</p>
          )}
        </div>
      </div>

      {/* 모달 팝업 */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "30px",
          width: "500px",
          backgroundColor: "#fff",
          border: "1px solid #8BC9FF",
          borderRadius: "10px",
          zIndex: 1000,
        }}>
          <h2>새 게시물 작성</h2>
          <input
            type="text"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            style={{ width: "100%", padding: "10px", marginBottom: "10px", fontSize: "16px", border: "1px solid #8BC9FF", borderRadius: "5px" }}
          />
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="게시물 내용을 입력하세요..."
            style={{ width: "100%", height: "150px", padding: "10px", fontSize: "14px", marginBottom: "10px", border: "1px solid #8BC9FF", borderRadius: "5px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button className="custom-btn" onClick={handlePostSubmit}>등록</button>
            <button className="custom-btn" onClick={toggleModal}>취소</button>
          </div>
        </div>
      )}

      {/* 설명 수정 모달 */}
      {isEditModalOpen && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "30px",
          width: "500px",
          backgroundColor: "#fff",
          border: "1px solid #8BC9FF",
          borderRadius: "10px",
          zIndex: 1000,
        }}>
          <h2>스터디 설명 수정</h2>
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="스터디 설명을 수정하세요..."
            style={{ width: "100%", height: "150px", padding: "10px", fontSize: "14px", marginBottom: "10px", border: "1px solid #8BC9FF", borderRadius: "5px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button className="custom-btn" onClick={handleDescriptionUpdate}>저장</button>
            <button className="custom-btn" onClick={toggleEditModal}>취소</button>
          </div>
        </div>
      )}

      {/* 스타일 */}
      <style>
      {`
          ul {
            list-style-type: none;  /* 리스트 스타일을 없애 점 제거 */
            padding: 0;  /* 패딩도 제거하여 깔끔하게 */
          }

          /* 제목 링크 부분 숨기기 */
          a {
            text-decoration: none;  /* 링크의 밑줄 제거 */
            color: inherit;  /* 부모 요소의 색상 상속 */
          }

          .custom-btn {
            padding: 5px 10px;
            border: 1px solid #8BC9FF;
            background-color: white;
            color: black;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .custom-btn:hover {
            background-color: #8BC9FF;
            color: white;
          }
          ::-webkit-scrollbar {
            width: 10px;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: #8BC9FF;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-track {
            background-color: #f5f5f5;
          }
        `}
      </style>
    </div>
  );
}

export default StudyRoomPage;
