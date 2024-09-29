import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from '../store/hooks.ts';
import StudyInfo from '../component/StudyRoomPage/StudyInfo';
import PostList from '../component/StudyRoomPage/PostList.jsx';
import MemberList from '../component/StudyRoomPage/MemberList.jsx';
import CreatePostModal from '../component/StudyRoomPage/CreatePostModal';
import EditDescriptionModal from '../component/StudyRoomPage/EditDescriptionModal';

function StudyRoomPage() {
  const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn);
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const { studyId } = useParams();
  
  const [studyRoom, setStudyRoom] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isMemberListOpen, setIsMemberListOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    fetchStudyRoom();
    fetchMembers();
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
        setEditedDescription(data.description);
      })
      .catch(error => console.error("Failed to fetch study room:", error));
  };

  const fetchMembers = () => {
    fetch(`/studies/${studyId}/members`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMemberCount(data.length);
          setMembers(data);
        } else {
          console.error("Invalid data format:", data);
        }
      })
      .catch(error => console.error("Failed to fetch members:", error));
  };

  const fetchPosts = () => {
    fetch(`/boards/study/${studyId}`)
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error("Failed to fetch posts:", error));
  };

  const handleDescriptionUpdate = () => {
    if (window.confirm("정말로 수정하시겠습니까?")) {
      const updatedStudyRoom = { ...studyRoom, description: editedDescription };
      fetch(`/studies/${studyId}?loggedInMemberId=${user.memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStudyRoom)
      })
        .then(response => response.json())
        .then(data => {
          setStudyRoom(data);
          setIsEditModalOpen(false);
          alert("수정이 완료되었습니다.");
        })
        .catch(error => {
          console.error("Failed to update description:", error);
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
          setMemberCount(prevCount => prevCount - 1);
          setMembers(prevMembers => prevMembers.filter(member => member.memberId !== user.memberId));
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
        content: postContent,
        memberId: user.memberId,
        nickname: user.nickname,
        studyId: studyId,
      };
      fetch('/boards', {
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
        memberCount={memberCount}
        onEditClick={() => setIsEditModalOpen(true)}
        onMemberListClick={() => setIsMemberListOpen(true)}
        onCamStudyClick={handleCamStudy}
        onLeaveClick={handleStudyOut}
        isCreator={user.memberId === studyRoom.memberId}
      />
      <PostList
        posts={posts}
        onCreatePost={() => setIsPostModalOpen(true)}
      />
      {isMemberListOpen && (
        <MemberList
          members={members}
          onClose={() => setIsMemberListOpen(false)}
        />
      )}
      {isPostModalOpen && (
        <CreatePostModal
          onSubmit={handlePostSubmit}
          onClose={() => setIsPostModalOpen(false)}
        />
      )}
      {isEditModalOpen && (
        <EditDescriptionModal
          description={editedDescription}
          onDescriptionChange={setEditedDescription}
          onSave={handleDescriptionUpdate}
          onClose={() => setIsEditModalOpen(false)}
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