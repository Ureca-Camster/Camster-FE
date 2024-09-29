import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { updateMyStudyGroup } from '../store/myStudyGroupsSlice.ts';
import StudyInfo from '../component/StudyRoomPage/StudyInfo';
import PostList from '../component/StudyRoomPage/PostList.jsx';
import MemberList from '../component/StudyRoomPage/MemberList.jsx';
import CreatePostModal from '../component/StudyRoomPage/CreatePostModal';
import StudyUpdateModal from "../component/StudyRoomPage/StudyUpdateModal.jsx";

function StudyRoomPage() {
  const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn);
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { studyId } = useParams();
  
  const [studyRoom, setStudyRoom] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isMemberListOpen, setIsMemberListOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    fetchStudyRoom();
    fetchPosts();
  }, [studyId, isLoggedIn, navigate, user.memberId]);

  const fetchStudyRoom = () => {
    fetch(`/studies/${studyId}`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch study room data');
        return response.json();
      })
      .then(data => {
        setStudyRoom(data);
      })
      .catch(error => console.error("Failed to fetch study room:", error));
  };

  const fetchPosts = () => {
    fetch(`/studies/${studyId}/boards`)
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error("Failed to fetch posts:", error));
  };

  const handleStudyUpdate = (updatedStudy) => {
    if (window.confirm("정말로 수정하시겠습니까?")) {
      fetch(`/studies/${studyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStudy),
      })
        .then(response => {
          if (!response.ok) throw new Error('Failed to update study room data');
          return fetch(`/studies/${studyId}`);  // 업데이트 후 최신 데이터를 다시 가져옵니다.
        })
        .then(response => response.json())
        .then(data => {
          setStudyRoom(data);
          // Redux 상태 업데이트
          dispatch(updateMyStudyGroup({
            studyId: data.studyId,
            studyName: data.studyName,
            description: data.description,
            emoji: data.emoji
          }));
          setIsUpdateModalOpen(false);
          alert("수정이 완료되었습니다.");
        })
        .catch(error => {
          console.error("Failed to update study:", error);
          alert("수정에 실패했습니다.");
        });
    }
  };
  
  const handleCamStudy = () => {
    window.open(`/study/${studyId}/camstudy`, '_blank');
  };

  const handleStudyOut = () => {
    if (window.confirm("정말로 스터디에서 탈퇴하시겠습니까?")) {
      fetch(`/studies/${studyId}/members/${user.memberId}`, { method: 'DELETE' })
        .then(() => {
          alert("스터디에서 탈퇴하였습니다.");
          navigate("/");
        })
        .catch(error => {
          console.error("Failed to leave study:", error);
          alert("탈퇴에 실패했습니다.");
        });
    }
  };

  const handlePostSubmit = (postTitle, postContent) => {
    if (window.confirm("등록 하시겠습니까?")) {
      const newPost = {
        title: postTitle,
        content: postContent
      };
      fetch(`/studies/${studyId}/boards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      })
        .then(response => response.json())
        .then(data => {
          setPosts([...posts, data]);
          setIsPostModalOpen(false);
        })
        .catch(error => console.error("Failed to submit post:", error));
    }
  };

  if (!studyRoom) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <StudyInfo
        studyRoom={studyRoom}
        memberCount={studyRoom.members.length}
        onEditClick={() => setIsUpdateModalOpen(true)}
        onMemberListClick={() => setIsMemberListOpen(true)}
        onCamStudyClick={handleCamStudy}
        onLeaveClick={handleStudyOut}
        isCreator={user.memberId === studyRoom.leaderId}
      />
      <PostList
        posts={posts}
        onCreatePost={() => setIsPostModalOpen(true)}
      />
      {isMemberListOpen && (
        <MemberList
          members={studyRoom.members}
          onClose={() => setIsMemberListOpen(false)}
        />
      )}
      {isPostModalOpen && (
        <CreatePostModal
          onSubmit={handlePostSubmit}
          onClose={() => setIsPostModalOpen(false)}
        />
      )}
      {isUpdateModalOpen && (
        <StudyUpdateModal
          show={isUpdateModalOpen}
          onHide={() => setIsUpdateModalOpen(false)}
          onSubmit={handleStudyUpdate}
          studyRoom={studyRoom}
        />
      )}
      <style>{`
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
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "20px",
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    position: "relative"
  }
};

export default StudyRoomPage;