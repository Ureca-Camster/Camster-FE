import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { updateMyStudyGroup, removeMyStudyGroup } from '../store/myStudyGroupsSlice.ts';
import Swal from 'sweetalert2';
import StudyInfo from '../component/StudyRoomPage/StudyInfo';
import PostList from '../component/StudyRoomPage/PostList.jsx';
import MemberList from '../component/StudyRoomPage/MemberList.jsx';
import CreatePostModal from '../component/StudyRoomPage/CreatePostModal';
import StudyUpdateModal from "../component/StudyRoomPage/StudyUpdateModal.jsx";
import PostViewModal from "../component/StudyRoomPage/PostViewModal.jsx";
import { Container, Col } from "react-bootstrap";

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
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPostViewModalOpen, setIsPostViewModalOpen] = useState(false);

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
    fetch(`/studies/${studyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedStudy),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to update study room data');
        return fetch(`/studies/${studyId}`);
      })
      .then(response => response.json())
      .then(data => {
        setStudyRoom(data);
        dispatch(updateMyStudyGroup({
          studyId: data.studyId,
          studyName: data.studyName,
          description: data.description,
          emoji: data.emoji
        }));
        setIsUpdateModalOpen(false);
        Swal.fire({
          icon: 'success',
          title: '수정 완료',
          toast: true,
          showConfirmButton: false,
          timer: 1200
        });
      })
      .catch(error => {
        console.error("Failed to update study:", error);
        Swal.fire({
          icon: 'error',
          title: '수정 실패',
          text: '다시 시도해 주세요',
          toast: true,
          showConfirmButton: false,
          timer: 1200
        });
      });
  };
  
  const handleCamStudy = () => {
    Swal.fire({
      text: '새 창에서 캠 스터디를 시작하시겠습니까?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '시작',
      cancelButtonText: '취소'
    }).then((result) => {
      if (result.isConfirmed) {
        window.open(`/study/${studyId}/camstudy`, '_blank');
      }
    });
  };

  const handleStudyOut = () => {
    Swal.fire({
      text: "스터디에서 탈퇴하시겠습니까?",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '탈퇴',
      cancelButtonText: '취소'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/studies/${studyId}`, { method: 'DELETE' })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to leave study');
            }
            return response.text();
          })
          .then(text => {
            if (text) {
              return JSON.parse(text);
            }
          })
          .then(() => {
            dispatch(removeMyStudyGroup(Number(studyId)));
            Swal.fire({
              icon: 'success',
              title: '탈퇴 완료!',
              toast: true,
              showConfirmButton: false,
              timer: 1200
            });
            navigate("/");
          })
          .catch(error => {
            console.error("Failed to leave study:", error);
            Swal.fire({
              icon: 'error',
              title: '탈퇴 오류',
              text: '다시 시도해주세요.',
              toast: true,
              showConfirmButton: false,
              timer: 1200
            });
          });
      }
    });
  };

  const handlePostSubmit = (postTitle, postContent) => {
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
      Swal.fire({
        icon: 'success',
        title: '게시물 등록 완료',
        toast: true,
        showConfirmButton: false,
        timer: 1200
      });
    })
    .catch(error => {
      console.error("Failed to submit post:", error);
      Swal.fire({
        icon: 'error',
        title: '게시물 등록 실패',
        text: '다시 시도해 주세요',
        toast: true,
        showConfirmButton: false,
        timer: 1200
      });
    });
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsPostViewModalOpen(true);
  };

  const handleClosePostViewModal = () => {
    setIsPostViewModalOpen(false);
    setSelectedPost(null);
  };

  if (!studyRoom) return <div>Loading...</div>;

  return (
    <Container style={styles.container}>
      <Col>
      <StudyInfo
        studyRoom={studyRoom}
        memberCount={studyRoom.members.length}
        onEditClick={() => setIsUpdateModalOpen(true)}
        onMemberListClick={() => setIsMemberListOpen(true)}
        onCamStudyClick={handleCamStudy}
        onLeaveClick={handleStudyOut}
        isLeader={user.memberId === studyRoom.leaderId}
      />
      </Col>
      <Col>
      <PostList
        posts={posts}
        onCreatePost={() => setIsPostModalOpen(true)}
        onPostClick={handlePostClick}
      />
      </Col>
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
      {isPostViewModalOpen && (
        <PostViewModal
          studyId={studyId}
          post={selectedPost}
          onClose={handleClosePostViewModal}
          onPostUpdated={fetchPosts}
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
    </Container>
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