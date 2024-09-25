import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from '../store/hooks.ts'; // 현재 로그인한 사용자 정보를 가져오기 위함

function PostViewPage() {
  const { boardId } = useParams();  // URL에서 boardId 파라미터 가져오기
  const [post, setPost] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  // 수정 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 모달 상태
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);  // Redux에서 로그인한 사용자 정보 가져오기

  useEffect(() => {
    // 게시물 정보를 가져오는 API 호출
    fetch(`http://localhost:8080/boards/${boardId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch post data");
        }
        return response.json();  // 응답을 JSON으로 변환
      })
      .then(data => {
        setPost(data);  // 게시물 데이터를 상태에 저장
        setEditedTitle(data.title);  // 수정 시 기본값으로 제목 설정
        setEditedContent(data.content);  // 수정 시 기본값으로 내용 설정
      })
      .catch(error => {
        console.error("게시물 정보를 불러오는데 실패했습니다.", error);
      });
  }, [boardId]);

  // 수정 모달을 열기/닫기
  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  // 삭제 모달을 열기/닫기
  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  // 게시물 수정 함수
  const handleEditSubmit = () => {
    const updatedPost = {
      ...post,
      title: editedTitle,
      content: editedContent,
      memberId: user.memberId,  // 로그인한 사용자의 ID를 함께 전송
    };

    fetch(`http://localhost:8080/boards/${boardId}?currentMemberId=${user.memberId}`, {
      method: 'PUT',  // PUT 요청으로 수정
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPost)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("게시물 수정에 실패했습니다.");
      }
      return response.json();
    })
    .then(data => {
      setPost(data);  // 수정된 게시물 다시 상태에 저장
      toggleEditModal();  // 모달 닫기
    })
    .catch(error => {
      console.error("게시물 수정에 실패했습니다.", error);
    });
  };

  // 게시물 삭제 함수
  const handleDelete = () => {
    fetch(`http://localhost:8080/boards/${boardId}?currentMemberId=${user.memberId}`, {
      method: 'DELETE',  // DELETE 요청으로 삭제
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("게시물 삭제에 실패했습니다.");
      }
      navigate(`/study/${post.studyId}`);  // 삭제 후 스터디룸으로 리다이렉트
    })
    .catch(error => {
      console.error("게시물 삭제에 실패했습니다.", error);
    });
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>뒤로</button> {/* 뒤로 가기 버튼 */}
      <h1>{post.title}</h1>
      <p>작성자: {post.nickname}</p>
      <p>작성일: {new Date(post.createDate).toLocaleString()}</p>
      <p>{post.content}</p>

      {/* 수정 및 삭제 버튼 */}
      {user.memberId === post.memberId && (  // 작성자와 현재 사용자가 같을 때만 수정/삭제 버튼 표시
        <>
          <button onClick={toggleEditModal}>수정</button>
          <button onClick={toggleDeleteModal}>삭제</button>
        </>
      )}

      {/* 수정 모달 */}
      {isEditModalOpen && (
        <div style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          padding: "30px", backgroundColor: "#fff", border: "1px solid #ddd", zIndex: 1000
        }}>
          <h2>게시물 수정</h2>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="제목 수정"
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="내용 수정"
            style={{ width: "100%", height: "150px", padding: "10px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
            <button onClick={handleEditSubmit}>저장</button>
            <button onClick={toggleEditModal}>취소</button>
          </div>
        </div>
      )}

      {/* 삭제 모달 */}
      {isDeleteModalOpen && (
        <div style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          padding: "30px", backgroundColor: "#fff", border: "1px solid #ddd", zIndex: 1000
        }}>
          <h2>게시물 삭제</h2>
          <p>이 게시물을 삭제하시겠습니까?</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
            <button onClick={handleDelete}>삭제</button>
            <button onClick={toggleDeleteModal}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostViewPage;
